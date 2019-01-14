$(document).ready(function () {
    $(".date-picker").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0
    });

    $("#submit_btn").click(function () {
        if ($("#first_name").val().trim() == "") {
            $("#first_name").parent().find('.help-block').html("Please enter first name.");
            return;
        }
        $("#first_name").parent().find('.help-block').html("");
        if ($("#last_name").val().trim() == "") {
            $("#last_name").parent().find('.help-block').html("Please enter last name.");
            return;
        }
        $("#last_name").parent().find('.help-block').html("");
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test($("#email").val())) {
            $("#email").parent().find('.help-block').html("Please enter valid  email");
            return;
        }
        $("#email").parent().find('.help-block').html("");
        if ($("#company_name").val().trim() == "") {
            $("#company_name").parent().find('.help-block').html("Please enter company name.");
            return;
        }
        $("#email").parent().find('.help-block').html("");
        if ($("#company_name").val().trim() == "") {
            $("#company_name").parent().find('.help-block').html("Please enter company name.");
            return;
        }
        var date_reg = /^\d{4}-\d{2}-\d{2}$/;
        $("#company_name").parent().find('.help-block').html("");
        if (!date_reg.test($("#license_start_date").val())) {
            $("#license_start_date").parent().find('.help-block').html("Please enter valid start date");
            return;
        }
        $("#license_start_date").parent().find('.help-block').html("");
        if (!date_reg.test($("#license_end_date").val())) {
            $("#license_end_date").parent().find('.help-block').html("Please enter valid end date");
            return;
        }
        $("#license_end_date").parent().find('.help-block').html("");
        $("#reg_form").submit();
    });


    $(document).on("click", ".status", function () {
        var data = {};
        if ($(this).data("status") == 'active') {
            data = {
                "license_status": false
            };
        } else if ($(this).data("status") == 'inactive') {
            data = {
                "license_status": true
            };
        }
        var id = $(this).data("id");
        fetch('/company/' + id, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': "application/json"
                }
            }).then(response => response.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.license_status) {
                    $(this).html('Active');
                    $(this).data('status', 'active');
                    $(this).removeClass('btn-danger');
                    $(this).addClass('btn-success');
                } else {
                    $(this).html('Inactive');
                    $(this).data('status', 'inactive');
                    $(this).removeClass('btn-success');
                    $(this).addClass('btn-danger');
                }
            });
    });
});