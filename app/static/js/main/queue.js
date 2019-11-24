$(document).ready(function (e) {
    updateQueue();
    updateReady();
});

setInterval(function() {
    updateQueue();
    printNextUser();
}, 2000);

function updateReady() {
    var status = getAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/self/get/status');
    if (status.substring(0, 5) == 'READY' || status.substring(0, 3) == 'NOT') {
        $("#checkbox").prop("checked", true);
    }
}

function updateQueue() {
    $('tbody tr').remove();

    var queue = getAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/get');
    for (let i = 0; i < queue.length; i++) {
        const row = queue[i];
        $(  '<tr>' +
                '<th class="number" scope="row">' + row['number'] + '</th>' +
                '<td class="name_surname">' + row['name_surname'] + '</td>' +
                '<td class="lab_number">' + row['lab_number'] + '</td>' +
                '<td class="status">' + row['status'] +
                        (row['is_next'] ? ' <b style="color: red;">NEXT</b>' : '') + '</td>' +
            '</tr>'
        ).appendTo($('tbody'))
    }
}

$('.switch #checkbox').click(function (e) {
    const value = $('.switch input').is(":checked");
    const data = JSON.stringify({'status': value ? 'Ready' : 'Not ready'});
    postAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/change/status', data);
});

function printNextUser() {
    var username = getAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/next');
    var cur_username = getAjaxInformation(getProtocol() + '://' + getServerName() + '/api/self/username');

    if (username == cur_username) {

        var status = getAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/self/get/status');
        if (status.substring(0, 10) == 'PROCESSING') {
            let result = confirm('Have you passed?');
            if (result) {
                data = JSON.stringify({'status': 'Passed'});
                postAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/change/status', data);
            } else {
                data = JSON.stringify({'status': 'Not passed'});
                postAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/change/status', data);
            }
            $("#checkbox").prop("checked", false);
        }

        if (status.substring(0, 5) == 'READY') {
            let result = confirm('Are you ready?');
            if (result) {
                var data = JSON.stringify({'status': 'Processing'});
                postAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/change/status', data);
            } else {
                var data = JSON.stringify({'status': 'Not ready'});
                postAjaxInformation(getProtocol() + '://' + getServerName() + '/api/queue/change/status', data);
            }
            $("#checkbox").prop("checked", false);
        }
    }
}