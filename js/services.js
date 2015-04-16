var adminurl = "http://demo.bestdealfinance.com/mobileverify/";

var myservices = angular.module('myservices', [])

.factory('MyServices', function($http, $location) {
    return {
        userregister: function(signup) {
            return $http({
                url: adminurl + "signup",
                method: "POST",
                data: {
                    "AppId": "46b4e721-18bd-4fd6-8209-a805aea2da5b",
                    "Token": "1234",
                    "Data": {
                        "signup": {
                            "enq_name": signup.enq_name,
                            "enq_mobile": signup.enq_mobile,
                            "enq_email": signup.enq_email,
                            "enq_password1": signup.enq_password1,
                            "password_again": signup.password_again
                        }
                    }
                }
            });
        },
        userlogin: function(login) {
            return $http({
                url: adminurl + "mobilelogin",
                method: "POST",
                data: {
                    "AppId": "46b4e721-18bd-4fd6-8209-a805aea2da5b",
                    "Token": "1234",
                    "Data": {
                        "login": {
                            "enq_username": login.enq_username,
                            "enq_password": login.enq_password
                        }
                    }
                }
            })
        },
        getcategories: function() {
            return $http({
                url: adminurl + "getcategories",
                method: "POST",
                data: {
                    "AppId": "46b4e721-18bd-4fd6-8209-a805aea2da5b",
                    "Token": "1234",
                    "Data": {}
                }
            })
        },
        forgotpassword: function(email) {
            return $http({
                url: adminurl + "forgotpassword",
                method: "POST",
                data: {
                    "Token": "1234",
                    "Data": email
                }
            })
        },
        validateotp: function(otp) {
            return $http({
                url: adminurl + "otpdata",
                method: "POST",
                data: {
                    "AppId": "46b4e721-18bd-4fd6-8209-a805aea2da5b",
                    "Token": "1234",
                    "Data": {
                        "otpdata": {
                            "OTPno": otp.OTPno,
                            "U_mobile": otp.U_mobile,
                            "U_SessionForOTPvalidate": otp.U_SessionForOTPvalidate
                        }
                    }

                }
            })
        },
        setuser: function(userdata) {
            $.jStorage.set("user", userdata);
        },
        getuser: function() {
            return $.jStorage.get("user");
        },
        flushuser: function() {
            return $.jStorage.flush();
        }

    };

});