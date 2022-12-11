const staffMembers = Object()  
const scheduledDeliveries = Object()
let selected_user = null

function displayButton(status) {
    if (status === "In") {
        return `<button type="button" class="btn btn-danger">Out</button>`
    } else {
        `<button type="button" class="btn btn-success">In</button>`
    }
}

function editTableUser(cells, data) {
    console.log(cells, selected_user)
    cells[0].innerHTML = data[0]
    cells[1].innerHTML = data[1]
    cells[2].innerHTML = data[2]
    cells[3].innerHTML = data[3]
}

function clickUser(cells) {
    selected_user = cells
}

function findReturnTime(start, end) {
    var today = new Date();

    return {}
}

function formatTime(input) {
    console.log("Got input:", input)
    var startDate = new Date();
    var endDate =new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), input[0], input[1], 0);

    var diffMs = (endDate - startDate); // milliseconds between now & Christmas
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); //

    var formattedTime = ""
    if (diffHrs > 0) {
        formattedTime += `${diffHrs}h`
    }
    
    if (diffMins > 0) {
        if (formattedTime == "") {
            formattedTime += `${diffMins}m`
        } else {
            formattedTime += ` ${diffMins}m`
        }
    }

    if (formattedTime == "") {
        formattedTime = "Less than a minute"
    }

    return {"duration": formattedTime, "startDate": startDate.toTimeString().slice(0, 5), "endDate": endDate.toTimeString().slice(0, 5)}
}

function staffOut() {
    // staffMemberIsLate()
    if (selected_user == null) {
        alert("You haven't selected a staff member from the table!")
    } else {
        let input = prompt("When will they return? Format: XX:XX (Example: 19:00)")

        if (input.length > 5 || input.length < 4) {
            alert("Time must be formatted as this: xx:xx (example: 19:00)")
            return
        }
        
        input = input.split(":");
        let timeData = formatTime(input)

        data = ["Out", timeData["startDate"], timeData["duration"], timeData["endDate"]]

        editTableUser(selected_user, data)
        staffMembers[selected_user[4]] = {"returnTime": data[3], "isLate": false}

        console.log("Staff Members:", staffMembers)
    }
}

function staffIn() {
    if (selected_user == null) {
        alert("You haven't selected a staff member from the table!")
    } else {
        data = ["In", "", "", ""]
        editTableUser(selected_user, data)
        staffMembers[selected_user[4]] = {"returnTime": null}
    }
}

function addTableDataPerson(userData) {
    var table = document.getElementById("personalTable");
    var row = table.insertRow();
    

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);

    cell1.innerHTML = `<img src="${userData['results'][0]['picture']['thumbnail']}" width="30" height="30">`;
    cell2.innerHTML = userData['results'][0]['name']['first'];
    cell3.innerHTML = userData['results'][0]['name']['last'];
    cell4.innerHTML = userData['results'][0]['email'];
    cell5.innerHTML = "In";
    cell6.innerHTML = "";
    cell7.innerHTML = "";
    cell8.innerHTML = "";

    row.addEventListener("click", function(event) {
        clickUser([cell5, cell6, cell7, cell8, cell4])
    });

    // To prevent overlapping with names, both their first and last name will be used as a "user id"
    // False indicates if they are late for work.
    staffMembers[userData['results'][0]['email']] = {"returnTime": null, "isLate": false}

};

function addVehicle(userData) {
    var table = document.getElementById("deliveryTable");
    var row = table.insertRow();

    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);


    cell1.innerHTML = displayVehicle(userData['vehicle']);
    cell2.innerHTML = userData['name'];
    cell3.innerHTML = userData['surname'];
    cell4.innerHTML = userData['telephone'];
    cell5.innerHTML = userData['address'];
    cell6.innerHTML = userData['returnTime'];
};

function validateDelivery(vehicle, name, surname, telephone, address, returnTime) {
    // We use this function to ensure the correct format is used.
    // Return a value if it is not.
    data = {"valid": true, "cells": {0: false, 1: false, 2: false, 3: false, 4: false, 5: false}}

    if (returnTime.length < 1) {
        data['cells'][5] = true
        data['message'] = "You didn't declare their return time"
        data['valid'] = false
    }

    if (address.length < 1) {
        data['cells'][4] = true
        data['message'] = "You didn't declare a delivery address! This is crucial..."
        data['valid'] = false
    }

    if (isNaN(telephone) || telephone.length < 3) {
        data['cells'][3] = true
        data['message'] = "The phone number is not correct!"
        data['valid'] = false
    }

    if (surname.length < 1) {
        data['cells'][2] = true
        data['message'] = "You didn't declare their surname!"
        data['valid'] = false
    }

    if (name.length < 1) {
        data['cells'][1] = true
        data['message'] = "You didn't declare a name for this driver!"
        data['valid'] = false
    }
    
    console.log(vehicle)
    if (vehicle != "car" && vehicle != "trailer" && vehicle != "bike") {
        data['cells'][0] = true
        data['message'] = "The vehicle should be a: car, bike, trailer"
        data['valid'] = false
    }

    return data
};


function scheduleIsInvalid(data) {
    var x = document.getElementById("scheduleTable").getElementsByTagName("td");
    for (cell in data['cells']) {
        if (data['cells'][cell] === true) {
            x[Number(cell)].style.backgroundColor = "red";
        } else {
            x[Number(cell)].style.backgroundColor = null;
        }
    }

    alert(data['message'])
};

function emptyScheduler(data) {
    // Empties the scheduler so you can add new values easily!
    $("#scheduleTable tbody tr td").empty();
    var x = document.getElementById("scheduleTable").getElementsByTagName("td");

    for (cell in data['cells']) {
        x[Number(cell)].style.backgroundColor = null;
    }
};

function displayVehicle(vehicle) {
    if (vehicle == "car") {
        return `<i class="bi bi-car-front-fill"></i>`
    } else if (["truck", "trailer"].indexOf(vehicle) > 1) {
        return `<i class="bi bi-truck-front-fill"></i>`
    } else if (["bike", "motorbike"].indexOf(vehicle) > 1){
        return `<i class="bi bi-bicycle"></i>`
    }else {
        return ""
    }
};

function clearDeliveries() {
    $("#deliveryTable").find("tr:gt(0)").remove();
}

function staffMemberIsLate() {
    Toast.show({timeOut: 1});
}

function Time() {

    // Creating object of the Date class
    var date = new Date();

    // Get current hour
    var hour = date.getHours();
    // Get current minute
    var minute = date.getMinutes();
    // Get current second
    var second = date.getSeconds();
   
    // Variable to store AM / PM
    var period = "";
   
    // Assigning AM / PM according to the current hour
    if (hour >= 12) {
    period = "PM";
    } else {
    period = "AM";
    }
   
    // Converting the hour in 12-hour format
    if (hour == 0) {
    hour = 12;
    } else {
    if (hour > 12) {
    hour = hour - 12;
    }
    }
   
    // Updating hour, minute, and second
    // if they are less than 10
    hour = update(hour);
    minute = update(minute);
    second = update(second);
   
    // Adding time elements to the div
    document.getElementById("digital-clock").innerText = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${hour}:${minute}:${second}`;
   
    // Set Timer to 1 sec (1000 ms)
    setTimeout(Time, 1000);
   }
   
    // Function to update time elements if they are less than 10
    // Append 0 before time elements if they are less than 10
   function update(t) {
    if (t < 10) {
    return "0" + t;
    }
    else {
    return t;
    }
   }
   
   Time();

function scheduleDelivery() {
    $('#scheduleTable tr').each(function() {
        if (!this.rowIndex) return; // Ignores the first row
        var vehicle = this.cells[0].innerHTML;
        var name = this.cells[1].innerHTML;
        var surname = this.cells[2].innerHTML;
        var telephone = this.cells[3].innerHTML;
        var address = this.cells[4].innerHTML;
        var returnTime = this.cells[5].innerHTML;
        
        // Small bug causes <br> lines to be added even when not added (sometimes)
        // This solves this issue
        vehicle = vehicle.replace("<br>", "")
        telephone = telephone.replace("<br>", "")
        returnTime = returnTime.replace("<br>", "")

        returnTime = returnTime.split(":");
        let timeData = formatTime(returnTime)
        
        console.log("Giving cehicle:", vehicle)
        console.log(timeData, returnTime)
        var data = validateDelivery(vehicle, name, surname, telephone, address, this.cells[5].innerHTML);

        if (data['valid'] === false) {
            scheduleIsInvalid(data)
        } else {
            addVehicle({"vehicle": vehicle, "name": name, "surname": surname, "telephone": telephone, "address": address, "returnTime": timeData["endDate"]})
            emptyScheduler(data)
        }

    });
}

function staffUserGet() {
    var request = new XMLHttpRequest();

    request.open('GET', 'https://randomuser.me/api/');

    request.onload = function() {
    var response = request.response
    var parsedData = JSON.parse(response);
        addTableDataPerson(
            parsedData
        )
    }

    request.send()
};

function populateStaffTable(amount) {
    for (let numberOfPeople = 0; numberOfPeople < amount; numberOfPeople++) {
        staffUserGet()
    }
};

function addTableDataDelivery(userData) {
    var table = document.getElementById("deliveryTable");
    var row = table.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    var cell7 = row.insertCell(6);
    var cell8 = row.insertCell(7);
    var cell9 = row.insertCell(8);

    cell1.innerHTML = `<img src="${userData['image']}" width="5" height="5">`;
    cell2.innerHTML = userData['name']
    cell3.innerHTML = userData['surname'];
    cell4.innerHTML = userData['email'];
    cell5.innerHTML = userData['status'];
    cell6.innerHTML = userData['timeout'];
    cell7.innerHTML = userData['duration'];
    cell8.innerHTML = userData['returns'];
    cell9.innerHTML = `<button type="button" class="btn btn-danger">Register Absence</button>` + `<button type="button" class="btn btn-success">Register Emploee</button>`
};

// Adds 5 Random users (as per requests.)
populateStaffTable(5)  // This number can be altered to add more or fewer.