angular.module('starter.controllers', ['myservices'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, MyServices, $location) {

    //  DECLARATION

    //  ON LOGOUT FUNCTION
    $scope.logoutuser = function() {
        MyServices.flushuser();
        $location.url("/login");
    }

    if (!MyServices.getuser()) {
        $location.url("/login");
    }

})

.controller('LoginCtrl', function($scope, $stateParams, MyServices, $location, $ionicPopup, $timeout) {

    //  DECLARATION
    $scope.login = [];
    $scope.allvalidation = [];

    //  AUTHENTICATE JSTORAGE
    MyServices.flushuser();
    if (MyServices.getuser()) {
        $location.url("/app/home");
    }


    //  TESTING
    var catsuccess = function(data, status) {
        console.log(data);
    }
    MyServices.getcategories().success(catsuccess);

    //  USER LOGIN
    var loginsuccess = function(data, status) {
        console.log(data);
        if (data.msg == "fail") {
            var myPopup = $ionicPopup.show({
                title: data.msgText,
                scope: $scope,
            });
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 1500);
        } else {
            MyServices.setuser(data.Data);
            $location.url("/app/home");
        }
    }
    $scope.userlogin = function(login) {

        $scope.allvalidation = [{
            field: $scope.login.enq_username,
            validation: ""
        }, {
            field: $scope.login.enq_password,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);

        if (check) {
            MyServices.userlogin(login).success(loginsuccess);
        };
    }

})

.controller('RegisterCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $location, $timeout, $ionicModal, $interval, $ionicLoading) {

    //  DECARATION
    $scope.register = [];
    $scope.allvalidation = [];
    $scope.minutes = 5;
    $scope.seconds = 0;
    $scope.otpdata = [];

    //  USER REGISTRATION
    var registersuccess = function(data, status) {
        console.log(data);
        if (data.msg == "Dup") {
            var myPopup = $ionicPopup.show({
                title: "Already registered with this details",
                scope: $scope,
            });
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 1500);
        } else if (data.msg == "success") {
            $scope.modal.hide
            $location.url("/login");
        } else {
            $scope.otpdata = data;
            $scope.modal.show();
            $interval(callAtTimeout, 1000);
        }

        //  TIMER FUNCTION
        function callAtTimeout() {
            if ($scope.seconds == 0 && $scope.minutes == 0) {
                $scope.modal.hide();
            } else {
                if ($scope.seconds == 0) {
                    $scope.minutes = $scope.minutes - 1;
                    $scope.seconds = 60;
                    $scope.seconds = $scope.seconds - 1;
                } else {
                    $scope.seconds = $scope.seconds - 1;
                }
            }
        }
    }
    $scope.userregister = function(register) {

        //        $scope.register.pushwooshid = "123456789596666";
        $scope.allvalidation = [{
            field: $scope.register.enq_name,
            validation: ""
        }, {
            field: $scope.register.enq_mobile,
            validation: ""
        }, {
            field: $scope.register.enq_email,
            validation: ""
        }, {
            field: $scope.register.enq_password1,
            validation: ""
        }, {
            field: $scope.register.password_again,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);

        if (check) {
            MyServices.userregister(register).success(registersuccess);
        };
    }

    //  OTP MODAL
    $ionicModal.fromTemplateUrl('templates/confirmotp.html', {
        scope: $scope,
        animation: 'pop-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });


    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    //  SUBMIT OTP
    var validateotpsuccess = function(data, status) {
        console.log(data);
        $ionicLoading.hide();
        if (data.msg == "success") {
            $scope.modal.hide();
            $location.url("/login");
        } else {
            var myPopup = $ionicPopup.show({
                title: data.msg,
                scope: $scope,
            });
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
            }, 1500);
        }
    }
    $scope.otpsubmit = function(otpdata) {
        console.log("otp otp");
        console.log($scope.register.enq_password1);
        $scope.allvalidation = [{
            field: $scope.otpdata.userotp,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);

        if (check) {
            $scope.userotp = otpdata.userotp;
            $scope.otpdata.mobile = $scope.register.enq_mobile;
            $scope.otpdata.password = $scope.register.enq_password1;
            console.log("otp data");
            console.log($scope.otpdata);
            $ionicLoading.show({
                template: 'Please wait...'
            });
            MyServices.validateotp($scope.otpdata).success(validateotpsuccess);
        };

    }
})

.controller('ForgotCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {

    //  DECLARATION
    $scope.allvalidation = [];
    $scope.forgot = [];

    //  ON FORGOT PASSWORD
    var forgotsuccess = function(data, status) {
        console.log(data);
        if (data.msg == "success") {
            var myPopup = $ionicPopup.show({
                title: "Your new password has been sent on your registered email id",
                scope: $scope,
            });
            $timeout(function() {
                myPopup.close(); //close the popup after 3 seconds for some reason
                $location.url("/login");
            }, 1500);
        } else {
            var myPopup1 = $ionicPopup.show({
                title: data.msg,
                scope: $scope,
            });
            $timeout(function() {
                myPopup1.close(); //close the popup after 3 seconds for some reason
            }, 1500);
        }

    }
    $scope.userforgotpassword = function(forgot) {
        $scope.allvalidation = [{
            field: $scope.forgot.email,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);

        if (check) {
            MyServices.forgotpassword(forgot).success(forgotsuccess);
        };

    }

})

.controller('HomeCtrl', function($scope, $stateParams) {})

.controller('MyplanCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location, $filter, $ionicLoading) {

    //  DECLARATION
    $scope.plan = [];
    $scope.planlist = [];
    $scope.plan.plandate = new Date();
    $scope.planingfor = MyServices.getplaningfor();
    $scope.plan.planingfor = $scope.planingfor[0].text;
    $ionicLoading.show({
        template: 'Please wait...'
    });

    //  CHANGE TAB
    $scope.changetab = function(planfor) {
        for (var i = 0; i < $scope.planingfor.length; i++) {
            $scope.planingfor[i].select = "";
        }

        planfor.select = "selected";
        $scope.plan.planingfor = planfor.text;
    }

    //  GET ALL USER PLANS
    var listplansuccess = function(data, status) {
        console.log(data);
        $scope.planlist = data.Data;
        $ionicLoading.hide();
    }
    MyServices.listallmyplans().success(listplansuccess);

    //  INSERT USER PLAN
    var plansuccess = function(data, status) {
        console.log(data);
        var myPopup1 = $ionicPopup.show({
            title: data.msg,
            scope: $scope,
        });
        $timeout(function() {
            myPopup1.close(); //close the popup after 3 seconds for some reason
            $location.url("/app/listplan");
        }, 1500);
    }
    $scope.inserplan = function(plan) {
        $scope.allvalidation = [{
            field: $scope.plan.planame,
            validation: ""
        }, {
            field: $scope.plan.planamount,
            validation: ""
        }, {
            field: $scope.plan.plandate,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);

        if (check) {
            $scope.plan.plandate = $filter('date')($scope.plan.plandate, "yyyy-MM-dd");
            MyServices.Insertmyplans($scope.plan).success(plansuccess);
        };

    }

    //  DELETE PLAN
    var deleteplansuccess = function(data, status) {
        console.log(data);
        MyServices.listallmyplans().success(listplansuccess);
        var myPopup1 = $ionicPopup.show({
            title: data.msg,
            scope: $scope,
        });
        $timeout(function() {
            myPopup1.close(); //close the popup after 3 seconds for some reason
        }, 1500);
    }
    $scope.deleteplan = function(planid) {
        console.log(planid);
        MyServices.daletetmyplans(planid).success(deleteplansuccess);
    }
})

.controller('EditMyplanCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location, $filter, $ionicLoading) {

    //  DECLARATION
    $scope.plan = [];
    $scope.planlist = [];
    $scope.plan.plandate = new Date();
    $scope.planingfor = MyServices.getplaningfor();
    $scope.plan.planingfor = $scope.planingfor[0].text;
    //    $ionicLoading.show({
    //        template: 'Please wait...'
    //    });

    //  CHANGE TAB
    $scope.changetab = function(planfor) {
        for (var i = 0; i < $scope.planingfor.length; i++) {
            $scope.planingfor[i].select = "";
        }

        planfor.select = "selected";
        $scope.plan.planingfor = planfor.text;
    }

    //  GET SINGLE PLAN
    var singleplansuccess = function(data, status) {
        console.log(data);
        $scope.plan = data.Data[0];
        $scope.plan.planame = data.Data[0].planname;
        for (var i = 0; i < $scope.planingfor.length; i++) {
            if ($scope.planingfor[i].text == data.Data[0].planingfor) {
                $scope.planingfor[i].select = "selected";
            } else {
                $scope.planingfor[i].select = "";
            }
        }
    }
    MyServices.mysingleplan($stateParams.id).success(singleplansuccess);

    //  UPDATE PLAN
    var updatesuccess = function(data, status) {
        console.log(data);
        var myPopup1 = $ionicPopup.show({
            title: data.msg,
            scope: $scope,
        });
        $timeout(function() {
            myPopup1.close(); //close the popup after 3 seconds for some reason
            $location.url("/app/listplan");
        }, 1500);
    }
    $scope.updateplan = function() {
        $scope.allvalidation = [{
            field: $scope.plan.planame,
            validation: ""
        }, {
            field: $scope.plan.planamount,
            validation: ""
        }, {
            field: $scope.plan.plandate,
            validation: ""
        }];
        var check = formvalidation($scope.allvalidation);

        if (check) {
            $scope.plan.plandate = $filter('date')($scope.plan.plandate, "yyyy-MM-dd");
            MyServices.updatetmyplans($scope.plan).success(updatesuccess);
        };
        
    }

})

.controller('FinanceCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {

    //  DECLARATION
    $scope.categories = [];


    //  GET CATEGORIES
    var categorysuccess = function(data, status) {
        console.log(data);
        $scope.categories = data.Data;
    }
    MyServices.getcategories().success(categorysuccess);


})

.controller('GenieCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})

.controller('LoanCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('CheckCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location, $ionicLoading) {

        //  DEPLARATION
        $scope.checklist = [];
        $ionicLoading.show({
            template: 'Please wait...'
        });


        var plsuccess = function(data, status) {
            console.log(data);
            $ionicLoading.hide();
            if (data.Response != "Success") {
                var myPopup1 = $ionicPopup.show({
                    title: data.Response,
                    scope: $scope,
                });
                $timeout(function() {
                    myPopup1.close(); //close the popup after 3 seconds for some reason
                    $location.url("/app/personal");
                }, 1500);
            } else {
                $scope.checklist = data.Data;
            }
        }
        MyServices.stepawaypl().success(plsuccess);

    })
    .controller('TwowheelerListCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('TwowheelerchkCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('TwowheelerapplyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('SecuritychkCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('SecuritychkformCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('SecurityapplyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('PropertychkCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('PropertychkformCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('PropertyapplyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('CarApplyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('CarChkListCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('HomeChkListCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('HomeApplyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('HomeChkCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('CreditCtrl', function($scope, $stateParams, $ionicModal, MyServices, $ionicPopup, $timeout, $location) {
        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openedit = function() {
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };
    })
    .controller('MyAccountCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $location) {

        //  DECLARATION
        $scope.returnsactive = "active";
        $scope.profile = "bold";
        $scope.user = [];

        //  DESIGN CODE
        $scope.changemyapp = function() {
            $scope.myapp = "bold";
            $scope.profile = "";
        }

        $scope.chnageprofile = function() {
            $scope.myapp = "";
            $scope.profile = "bold";
        }

        //  GET USER DETAILS
        $scope.user = MyServices.getuser();

    })
    .controller('ConstructFormCtrl', function($scope, $stateParams, $ionicModal, MyServices, $ionicPopup, $timeout, $location) {

        $scope.carloan = {
            'loan': 20000,
            'tenure': 6,
            'income': 15000

        };
        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openedit = function() {
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };
    })
    .controller('CommericialCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('HealthCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('SmeBussniessCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('SmeProjectCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('SmeFilesCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('ReferPropertyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('ReferEarnCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('ReferalDetailsCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('CreditApplyCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('ReferCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('GenieDealCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('ContactusCtrl', function($scope, $stateParams, MyServices, $ionicPopup, $timeout, $location) {})
    .controller('PersonalLoanCtrl', function($scope, $stateParams, $ionicModal, MyServices, $ionicPopup, $timeout, $location, $filter) {

        //        console.log(age());

        //  DESIGN CODE
        $scope.personal = {
            'enq_loanAmtTo': 20000,
            'enq_tenureTo': 6,
            'enq_currIncomeTo': 15000,
            'enq_is_salaried_ddl': 'No',
            'enq_dob': new Date()
        };
        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openedit = function() {
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        //  DECLARATION
        $scope.cities = [];
        $scope.allvalidation = [];
        $


        // GET ALL DROPDOWN
        var dropsuccess = function(data, status) {
            $scope.cities = data.Data;
        }
        MyServices.getdropdowncity().success(dropsuccess);

        //  SELECT COMPANY
        $scope.selectcomp = function(comp) {
            console.log(comp);
            $scope.modal.hide();
            $scope.personal.enq_company_id = comp;
        }

        $scope.datechange = function() {
            if (parseInt(age($scope.personal.enq_dob)) < 21) {
                console.log("chintoo");
                var myPopup1 = $ionicPopup.show({
                    title: "Age should be Greater than 21",
                    scope: $scope,
                });
                $timeout(function() {
                    myPopup1.close(); //close the popup after 3 seconds for some reason
                }, 1500);
            }


        }


        //  PERSONAL FIRST LOAN FORN SUBMIT
        var stepawayplsuccess = function(data, status) {
            console.log(data);
        }
        $scope.getmedeals = function(personal) {
            console.log(personal);
            if ($scope.personal.salaried == "1") {
                $scope.allvalidation = [{
                    field: $scope.personal.enq_loanAmtTo,
                    validation: ""
                }, {
                    field: $scope.personal.enq_tenureTo,
                    validation: ""
                }, {
                    field: $scope.personal.enq_currIncomeTo,
                    validation: ""
                }, {
                    field: $scope.personal.enq_dob,
                    validation: ""
                }, {
                    field: $scope.personal.enq_city,
                    validation: ""
                }, {
                    field: $scope.personal.enq_is_salaried_ddl,
                    validation: ""
                }, {
                    field: $scope.personal.enq_company_id,
                    validation: ""
                }];
                var check = formvalidation($scope.allvalidation);
            } else {
                $scope.allvalidation = [{
                    field: $scope.personal.enq_loanAmtTo,
                    validation: ""
                }, {
                    field: $scope.personal.enq_tenureTo,
                    validation: ""
                }, {
                    field: $scope.personal.enq_currIncomeTo,
                    validation: ""
                }, {
                    field: $scope.personal.enq_dob,
                    validation: ""
                }, {
                    field: $scope.personal.enq_city,
                    validation: ""
                }, {
                    field: $scope.personal.enq_is_salaried_ddl,
                    validation: ""
                }, {
                    field: $scope.personal.enq_occupation,
                    validation: ""
                }];
                var check = formvalidation($scope.allvalidation);
            }

            if (check) {
                //                $scope.today = new Date();
                personal.enq_dob = $filter('date')(personal.enq_dob, "dd-MM-yyyy");
                console.log(personal.enq_dob);
                MyServices.stepawayset(personal);
                $location.url("/app/listcheckloan");
                //                MyServices.stepawaypl(personal).success(stepawayplsuccess);
            };
        }

    })
    .controller('CarLoanCtrl', function($scope, $stateParams, $ionicModal, MyServices, $ionicPopup, $timeout, $location) {

        $scope.carloan = {
            'loan': 20000,
            'tenure': 6,
            'income': 15000

        };
        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openedit = function() {
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

    })
    .controller('TwowheelerLoanCtrl', function($scope, $stateParams, $ionicModal) {

        $scope.carloan = {
            'loan': 20000,
            'tenure': 6,
            'income': 15000

        };
        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openedit = function() {
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };
    })
    .controller('SecurityLoanCtrl', function($scope, $stateParams, $ionicModal) {

        $scope.carloan = {
            'loan': 20000,
            'tenure': 6,
            'income': 15000

        };
        //        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
        //            scope: $scope,
        //            animation: 'slide-in-up'
        //        }).then(function (modal) {
        //            $scope.modal = modal;
        //        });
        //
        //        $scope.openedit = function () {
        //            $scope.modal.show();
        //        }
        //
        //        $scope.closeModal = function () {
        //            $scope.modal.hide();
        //        };

    })
    .controller('PropertyLoanCtrl', function($scope, $stateParams) {

        $scope.carloan = {
            'loan': 20000,
            'tenure': 6,
            'income': 15000

        };

    })
    .controller('CheckCarLoanCtrl', function($scope, $stateParams) {

        $scope.carloan = {
            'loan': 20000,
            'tenure': 6,
            'income': 15000

        };

    })
    .controller('HomeLoansCtrl', function($scope, $stateParams, $ionicModal) {

        //        $scope.carloan = {
        //            'loan': 20000,
        //            'tenure': 6,
        //            'income': 15000
        //
        //        };
        $ionicModal.fromTemplateUrl('templates/popupsearch.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openedit = function() {
            $scope.modal.show();
        }

        $scope.closeModal = function() {
            $scope.modal.hide();
        };

    })

.controller('PersonalChkCtrl', function($scope, $stateParams) {})

.controller('SMECtrl', function($scope, $stateParams) {});