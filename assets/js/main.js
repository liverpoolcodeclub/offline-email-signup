$(function(){

    var responses = store.get('responses') || [];
    var $form = $('.js-offline-form');

    var $download = $('<button>')
        .addClass('btn btn-link btn-download')
        .appendTo('body');

    var saveResponse = function saveResponse(response){
        var keyValuePairs = {};
        $.each(response, function(i, pair){
            keyValuePairs[pair["name"]] = pair["value"];
        });
        responses.push(keyValuePairs);
        store.set('responses', responses);
    };

    var resetForm = function resetForm(){
        $('.js-default-empty', $form).val('');
        $('.js-default-checked', $form).attr('checked', true);
        $('.js-default-unchecked', $form).removeAttr('checked');
        $form.find('input').eq(0).focus();
    };

    var updateReponseCount = function updateReponseCount(){
        if(responses.length > 0){
            $download.text(responses.length).show();
        } else {
            $download.text(0).hide();
        }
    };

    var showThankyouMessage = function showThankyouMessage(){
        var $thankyou = $('<div>')
            .addClass('thankyou')
            .html('Saved – Thank you!')
            .appendTo('body');

        setTimeout(function(){
            $thankyou.fadeOut(500, function(){
                $thankyou.remove();
            });
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        }, 3000);
    };

    var downloadResponses = function downloadResponses(){
        var columns = [];
        var csv = 'data:text/csv;charset=utf-8,';

        $form.find('input[name]').each(function(){
            columns.push($(this).attr('name'));
        });

        csv += '"' + columns.join('","') + '"';

        $.each(responses, function(i, response){
            csv += '\n';
            console.log(i, response);
            $.each(columns, function(j, column){
                console.log(j, column);
                if(j > 0){
                    csv += ',';
                }
                if(column in response){
                    csv += '"' + response[column] + '"';
                }
            });
        });

        downloadStringAsFile(csv, 'responses.csv');
    };

    var downloadStringAsFile = function downloadStringAsFile(string, filename){
        var encodedUri = encodeURI(string);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    }

    resetForm();
    updateReponseCount();

    $form.on('submit', function(e){
        e.preventDefault();
        saveResponse( $(this).serializeArray() );
        showThankyouMessage();
        resetForm();
        updateReponseCount();
    });

    $download.on('click', function(){
        downloadResponses();
    });
});
