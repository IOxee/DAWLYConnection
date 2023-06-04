// window load
window.onload = function() {
    changeNavbarAuth();
    if (window.localStorage.getItem("token") != null) {
        addDashboardPage(window.localStorage.getItem("userLevel"));
    } else {
        addMainPage();
    }
}

removeAlertModal = function(id) {
    setTimeout(function() {
        $('.alert').animate({opacity: 0}, 500, function() {
            $(this).remove();
            $(`#${id}`).modal('hide');
        });
    }, 1500);

}

removeMainPage = function() {
    let section_bg = document.getElementById("section_bg");
    let shortener_section = document.getElementById("shortener_section");
    let three_columns = document.getElementById("three_columns");

    if (!section_bg.classList.contains("d-none")) section_bg.classList.add("d-none");
    if (!shortener_section.classList.contains("d-none")) shortener_section.classList.add("d-none");
    if (!three_columns.classList.contains("d-none")) three_columns.classList.add("d-none");
}

addMainPage = function() {
    let section_bg = document.getElementById("section_bg");
    let shortener_section = document.getElementById("shortener_section");
    let three_columns = document.getElementById("three_columns");
    if (section_bg.classList.contains("d-none")) section_bg.classList.remove("d-none");
    if (shortener_section.classList.contains("d-none")) shortener_section.classList.remove("d-none");
    if (three_columns.classList.contains("d-none")) three_columns.classList.remove("d-none");
}

removeDashboardPage = function() {
    let dashboard = document.getElementById("dashboard");
    let section_bg = document.getElementById("section_bg");
    let shortener_section = document.getElementById("shortener_section");
    let three_columns = document.getElementById("three_columns");


    if (!dashboard.classList.contains("d-none")) dashboard.classList.add("d-none");
    if (section_bg.classList.contains("d-none")) section_bg.classList.remove("d-none");
    if (shortener_section.classList.contains("d-none")) shortener_section.classList.remove("d-none");
    if (three_columns.classList.contains("d-none")) three_columns.classList.remove("d-none");

}

addDashboardPage = function(userLevel) {
    let dashboard = document.getElementById("dashboard");
    let section_bg = document.getElementById("section_bg");
    let shortener_section = document.getElementById("shortener_section");
    let three_columns = document.getElementById("three_columns");
    
    // si dashboard tine d-none quitarlo
    if (dashboard.classList.contains("d-none")) dashboard.classList.remove("d-none");
    if (!section_bg.classList.contains("d-none")) section_bg.classList.add("d-none");
    if (!shortener_section.classList.contains("d-none")) shortener_section.classList.add("d-none");
    if (!three_columns.classList.contains("d-none")) three_columns.classList.add("d-none");

    addToDashboardPage('home');
}

changeNavbarAuth = function() {
    let navbar = document.getElementById("navbar_auth");
    navbar.innerHTML = "";

    if (window.localStorage.getItem("token") != null) {
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.classList.add("btn");
        a.classList.add("mx-2");
        a.classList.add("my-3");
        a.setAttribute("type", "submit");
        a.innerHTML = `<i class="bi bi-person"></i> ${window.localStorage.getItem("username")}`;
        li.appendChild(a);

        let li2 = document.createElement("li");
        let a2 = document.createElement("a");
        a2.classList.add("btn");
        a2.classList.add("mx-2");   
        a2.classList.add("my-3");
        a2.setAttribute("type", "submit");
        a2.setAttribute("onclick", "logout()");
        a2.innerHTML = `<i class="bi bi-box-arrow-right"></i> Log out`;
        li2.appendChild(a2);

        navbar.appendChild(li);
        navbar.appendChild(li2);
    } else {
        let li = document.createElement("li");
        let a = document.createElement("button");
        a.classList.add("btn");
        a.classList.add("mx-2");
        a.classList.add("my-3");
        a.setAttribute("type", "button");
        a.setAttribute("data-bs-toggle", "modal");
        a.setAttribute("data-bs-target", "#loginModal");
        a.innerHTML = `<i class="bi bi-box-arrow-in-right"></i> Log in`;
        li.appendChild(a);

        let li2 = document.createElement("li");
        let a2 = document.createElement("button");
        a2.classList.add("btn");
        a2.classList.add("link-primary");
        a2.classList.add("mx-2");
        a2.classList.add("my-3");
        a2.setAttribute("type", "button");
        a2.setAttribute("data-bs-toggle", "modal");
        a2.setAttribute("data-bs-target", "#registerModal");
        a2.innerHTML = `<i class="bi bi-person-plus"></i> Sign up for free`;
        li2.appendChild(a2);

        let li3 = document.createElement("li");
        let a3 = document.createElement("a");
        a3.classList.add("btn");
        a3.classList.add("btn-outline-dark");
        a3.classList.add("mx-2");
        a3.classList.add("my-3");
        a3.setAttribute("type", "submit");
        a3.setAttribute("href", "");
        a3.innerHTML = `Get a Quote`;
        li3.appendChild(a3);
        
        navbar.appendChild(li);
        navbar.appendChild(li2);
        navbar.appendChild(li3);
    }
}

let loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let email = document.getElementById("login_email");
    let password = document.getElementById("login_password");

    var formData = new FormData();
    formData.append("email", email.value);
    formData.append("password", password.value);


    fetch("http://localhost/api/v1/login", {
        method: "POST",
        body: formData,
        redirect: "follow"
    }).then((response) => {
        return response.json();
    }).then((res) => {
        console.log(res);
        if (res.status == 200) {
            let div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add("alert-success");
            div.classList.add("mt-3");
            div.innerHTML = 'Successfully logged in.'
            let body = document.getElementById("loginForm");
            body.appendChild(div);
            removeAlertModal("loginModal");

            let localstorage = window.localStorage;
            localstorage.setItem("token", res.token);

            removeMainPage();
            localstorage.setItem("username", res.data.username);
            localstorage.setItem("userLevel", res.data.role.level);
            localstorage.setItem("e", res.data.email);
            changeNavbarAuth();
            addDashboardPage(res.data.role.level);  

        } else {
            let div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add("alert-danger");
            div.classList.add("mt-3");
            div.innerHTML = 'Invalid credentials.'
            let body = document.getElementById("loginForm");
            body.appendChild(div);
            removeAlertModal("loginModal");

            let localstorage = window.localStorage;
            localstorage.removeItem("token");
        }
    }).catch((err) => {
        console.log(err);
    });
});

let registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("register_username");
    let email = document.getElementById("register_email");
    let password = document.getElementById("register_password");
    let confirmPassword = document.getElementById("register_password_confirm");

    var formData = new FormData();
    formData.append("username", name.value);
    formData.append("email", email.value);
    formData.append("password", password.value);
    formData.append("password_confirm", confirmPassword.value);

    fetch("http://localhost/api/v1/register", {
        method: "POST",
        body: formData,
        redirect: "follow"
    }).then((response) => {
        return response.json();
    }).then((res) => {
        console.log(res);
        if (res.status == 200) {
            let div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add("alert-success");
            div.classList.add("mt-3");
            div.innerHTML = 'Successfully registered.'
            let body = document.getElementById("registerForm");
            body.appendChild(div);
            removeAlertModal('registerModal');

        } else {
            let div = document.createElement("div");
            div.classList.add("alert");
            div.classList.add("alert-danger");
            div.classList.add("mt-3");
            div.innerHTML = 'Invalid credentials.'
            let body = document.getElementById("registerForm");
            body.appendChild(div);
            removeAlertModal('registerModal');

        }
    }).catch((err) => {
        console.log(err);
    });
});

let navlinks = document.getElementsByClassName("nav-link");
for (let i = 0; i < navlinks.length; i++) {
    navlinks[i].addEventListener("click", (e) => {
        let goto = navlinks[i].getAttribute("data-goto");
        for (let j = 0; j < navlinks.length; j++) {
            navlinks[j].classList.remove("active");
        }
        navlinks[i].classList.add("active");

        if (goto == "home" || goto == "folders" || goto == null) {
            addToDashboardPage('home');
        } else if (goto == "createnew") {
            addToDashboardPage('createnew');
        } else if (goto == "manage") {
            addToDashboardPage('links');
        } else if (goto == "users") {
            addToDashboardPage('users');
        }

    });
}

function addToDashboardPage(page) {
    let dashboard = document.getElementById("dashboard_container");
    dashboard.innerHTML = "";
    let container = document.createElement("div");
    
    switch (page) {
        case 'home':
            container.classList.add("container-fluid");
            let row = document.createElement("div");
            row.classList.add("row");
            let col = document.createElement("div");
            col.classList.add("col-12");
            let h1 = document.createElement("h1");
            h1.classList.add("text-center");
            h1.innerHTML = "Dashboard";
            col.appendChild(h1);
            row.appendChild(col);
            container.appendChild(row);
            dashboard.appendChild(container);
            break;
        case 'createnew':
            container.classList.add("container-fluid");
            
            let row1 = document.createElement("div");
            row1.classList.add("row");
            
            let col1 = document.createElement("div");
            col1.classList.add("col-12");
            
            let h11 = document.createElement("h1");
            h11.classList.add("text-center");
            h11.innerHTML = "Create New";
            col1.appendChild(h11);
            row1.appendChild(col1);
            container.appendChild(row1);

            let row2 = document.createElement("div");
            row2.classList.add("row");
            
            let col2 = document.createElement("div");
            col2.classList.add("col-12");
            
            let form = document.createElement("form");
            form.classList.add("form-inline");
            form.classList.add("justify-content-center");
            form.classList.add("mt-3");
            form.setAttribute("id", "createNewForm");
            form.setAttribute("method", "POST");
            
            let input = document.createElement("input");
            input.classList.add("form-control");
            input.classList.add("mb-2");
            input.classList.add("mr-sm-2");
            input.setAttribute("type", "text");
            input.setAttribute("placeholder", "Link Title");
            input.setAttribute("id", "link_title");
            input.setAttribute("name", "link_title");
            
            let input2 = document.createElement("input");
            input2.classList.add("form-control");
            input2.classList.add("mb-2");
            input2.classList.add("mr-sm-2");
            input2.setAttribute("type", "text");
            input2.setAttribute("placeholder", "Link URL");
            input2.setAttribute("id", "domain");
            input2.setAttribute("name", "domain");
            
            let input3 = document.createElement("input");
            input3.classList.add("form-control");
            input3.classList.add("mb-2");
            input3.classList.add("mr-sm-2");
            input3.setAttribute("type", "text");
            input3.setAttribute("placeholder", "Link Description");
            input3.setAttribute("id", "link_description");
            input3.setAttribute("name", "link_description");

            let input_publish_date = document.createElement("input");
            input_publish_date.classList.add("form-control");
            input_publish_date.classList.add("mb-2");
            input_publish_date.classList.add("mr-sm-2");
            input_publish_date.setAttribute("type", "datetime-local");
            input_publish_date.setAttribute("placeholder", "Publish Date");
            input_publish_date.setAttribute("id", "publish_date");
            input_publish_date.setAttribute("name", "publish_date");
            input_publish_date.value = new Date().getUTCDate();

            let input_expire_date = document.createElement("input");
            input_expire_date.classList.add("form-control");
            input_expire_date.classList.add("mb-2");
            input_expire_date.classList.add("mr-sm-2");
            input_expire_date.setAttribute("type", "datetime-local");
            input_expire_date.setAttribute("placeholder", "Expire Date");
            input_expire_date.setAttribute("id", "expire_date");
            input_expire_date.setAttribute("name", "expire_date");
            input_expire_date.value = new Date().getUTCDate()
            
            let button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("btn-primary");
            button.classList.add("mb-2");
            button.setAttribute("type", "submit");
            button.setAttribute("id", "createNewButton");
            button.innerHTML = "Create";
            
            form.appendChild(input2);
            form.appendChild(input);
            form.appendChild(input3);
            form.appendChild(input_publish_date);
            form.appendChild(input_expire_date);

            form.appendChild(button);
            col2.appendChild(form);
            row2.appendChild(col2);
            container.appendChild(row2);
            dashboard.appendChild(container);

            let ls = window.localStorage;
            document.getElementById("createNewForm").addEventListener("submit", (e) => {
                e.preventDefault();

                let link_name = document.getElementById("link_title").value;
                let link_url = document.getElementById("domain").value;
                let link_description = document.getElementById("link_description").value;
                let publish_date = document.getElementById("publish_date").value;
                let expire_date = document.getElementById("expire_date").value;
            
                var myHeaders = new Headers();
                myHeaders.append("Authorization", `Bearer ${ls.getItem("token")}`);

                var formData = new FormData();
                formData.append("title", link_name);
                formData.append("domain", link_url);
                formData.append("description", link_description);
                formData.append("publish_date", publish_date);
                formData.append("limit_date", expire_date);

                fetch("http://localhost/api/v2/create", {
                    method: "POST",
                    headers: myHeaders,
                    body: formData,
                    redirect: "follow",
                })
                .then((response) => response.json())
                .then((res) => {
                    console.log(res);
                    if (res.status == 200) {
                        Swal.fire({
                            title: res.messages['header'],
                            icon: 'success',
                            html: res.messages['body'] + '<br> <a href=' + res.messages['link'] + '>' + res.messages['link'] + '</a>',
                            confirmButtonText: "Ok",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            });


            break;
        case 'links':
            let showed = false;
            let oldSearch = "";
            let localstorage = window.localStorage;
            let userLevel = localstorage.getItem("userLevel");

            container.classList.add("container-fluid");
        
            let row3 = document.createElement("div");
            row3.classList.add("row");
            
            let col3 = document.createElement("div");
            col3.classList.add("col-12");

            let h12 = document.createElement("h1");
            h12.classList.add("text-start");
            h12.classList.add("custom_font");
            h12.style.padding = "3.4rem 2.4rem 0 15.4rem";
            h12.innerHTML = "Links";

            col3.appendChild(h12);
            row3.appendChild(col3);
            container.appendChild(row3);

            let row4 = document.createElement("div");
            row4.classList.add("row");
            
            let col4 = document.createElement("div");
            col4.classList.add("col-12");

            let div_links = document.createElement("div");
            div_links.classList.add("input-group");
            div_links.classList.add("mb-3");

            let input_links = document.createElement("input");
            input_links.classList.add("form-control");
            input_links.setAttribute("type", "text");
            input_links.setAttribute("placeholder", "Search");
            input_links.setAttribute("id", "search");
            input_links.setAttribute("name", "search");
            input_links.setAttribute("aria-label", "Search");
            input_links.setAttribute("aria-describedby", "button-addon2");
            
            var locals = window.localStorage;
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${locals.getItem("token")}`);

            var formData = new FormData();
    
            input_links.addEventListener("input", function() {
                let mini_container = document.createElement("div");
                mini_container.classList.add("container-fluid");
                mini_container.setAttribute("id", "mini_container");
                mini_container.classList.add("d-flex");
                mini_container.classList.add('justify-content-center')
                
                let mini_row = document.createElement("div");
                mini_row.classList.add("row");
                
                let mini_col = document.createElement("div");
                mini_col.classList.add("col-12");
                
                let mini_h1 = document.createElement("h1");
                mini_h1.classList.add("text-start");
                mini_h1.classList.add("custom_font");
                
                let search = document.getElementById("search").value;
                formData.append('id', search);
                
                let url = `http://localhost/api/v2/options`
                fetch(url, {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData,
                    redirect: 'follow'
                })
                .then(response => response.json())
                .then(res => {
                    if (oldSearch != search) {
                        showed = false;
                        let mini_container = document.getElementById("mini_container");
                        if (mini_container != null) {
                            mini_container.innerHTML = "";
                        }
                    }

                    let title, description, html;
                    

                    if (res.status == 200) {
                        showed = true;
                        oldSearch = search;
                        document.getElementById("search").blur();

                        if (res.data.link_data.title == null) { title = "No title"; } else { title = res.data.link_data.title; }
                        if (res.data.link_data.description == null) { description = "No description"; } else { description = res.data.link_data.description; }
                        
                        html = 
                        '<div class="card mb-3">' +
                            '<div class="row g-0">' +
                                '<div class="col-12">' +
                                    '<div class="card-body">' +
                                        '<h5 class="card-title text-center">' + title + '</h5>' +
                                        '<p class="card-text text-center">' + description + '</p>' +
                                        '<br/>' +
                                        '<p class="card-text text-center"><small class="text-muted">Link Code: ' + res.data.link_data.link_code + '</small></p>' +
                                        '<p class="card-text text-center"><small class="text-muted">Created at: ' + res.data.link_data.publish_date + '</small></p>' +
                                        '<p class="card-text text-center"><small class="text-muted">Expires at: ' + res.data.link_data.limit_date + '</small></p>' +
                                        '<br/>' +
                                        '<a href="' + res.data.long_link + '" class="btn btn-primary">Go to link</a>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="container-fluid">' +
                            '<div class="row">' +
                                '<div class="col-12">' +
                                    '<form>' +
                                        '<div class="mb-3">' +
                                            '<label for="title" class="form-label">Title</label>' +
                                            '<input type="text" class="form-control" id="title" name="title" value="' + title + '">' +
                                        '</div>' +
                                        '<div class="mb-3">' +
                                            '<label for="description" class="form-label">Description</label>' +
                                            '<input type="text" class="form-control" id="description" name="description" value="' + description + '">' +
                                        '</div>' +
                                        '<div class="mb-3">' +
                                            '<label for="link" class="form-label">Link</label>' +
                                            '<input type="text" class="form-control" id="link" name="link" value="' + res.data.long_link + '">' +
                                        '</div>' +
                                        '<div class="mb-3">' +
                                            '<button type="button" class="btn btn-primary" id="update_link">Update</button>' +
                                        '</div>' +
                                    '</form>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    } else {
                        html = 
                        '<div class="card mb-3">' +
                            '<div class="row g-0">' +
                                '<div class="col-12">' +
                                    '<div class="card-body">' +
                                        '<h5 class="card-title text-center">No link found</h5>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    }


                    mini_h1.innerHTML = html;

                    mini_col.appendChild(mini_h1);
                    mini_row.appendChild(mini_col);
                    mini_container.appendChild(mini_row);
                    dashboard.appendChild(mini_container);

                    let update_link = document.getElementById("update_link");
                    update_link.addEventListener("click", function() {
                        let title = document.getElementById("title").value;
                        let description = document.getElementById("description").value;
                        let link = document.getElementById("link").value;

                        let formData = new FormData();
                        formData.append('short_link', search);
                        formData.append('title', title);
                        formData.append('description', description);
                        formData.append('domain', link);

                        let myHeaders = new Headers();
                        myHeaders.append("Authorization", `Bearer ${locals.getItem("token")}`);

                        fetch('http://localhost/api/v2/editlink', {
                            method: 'POST',
                            headers: myHeaders,
                            body: formData
                        })
                        .then(res => res.json())
                        .then(res => {
                            if (res.status == 200) {
                                alert("Link updated");
                            } else {
                                alert("Error updating link");
                            }
                        })
                        .catch(error => console.log(error));
                    });

                })
                .catch(error => console.log(error));
            });
        
            let div_links2 = document.createElement("div");
            div_links2.classList.add("input-group-append");

            let span = document.createElement("span");
            span.classList.add("input-group-text");
            span.setAttribute("id", "button-addon2");
            span.innerHTML = "Search";
            
            div_links2.appendChild(span);
            div_links.appendChild(input_links);
            div_links.appendChild(div_links2);
            col4.appendChild(div_links);
            row4.appendChild(col4);
            container.appendChild(row4);
            dashboard.appendChild(container);
            
            break;
        case 'users':
            var localstore = window.localStorage;

            container.classList.add("container-fluid");
        
            let row_users = document.createElement("div");
            row_users.classList.add("row");
            
            let col_users = document.createElement("div");
            col_users.classList.add("col-12");

            let h1_users = document.createElement("h1");
            h1_users.classList.add("text-start");
            h1_users.classList.add("custom_font");
            h1_users.innerHTML = "Users";

            col_users.appendChild(h1_users);
            row_users.appendChild(col_users);
            container.appendChild(row_users);

            let form_users = document.createElement("form");
            form_users.classList.add("row", "g-3");
            form_users.setAttribute("id", "form_users");

            // Username field
            let username_label = document.createElement("label");
            username_label.classList.add("form-label");
            username_label.innerHTML = "Username";
            
            let username_input = document.createElement("input");
            username_input.classList.add("form-control");
            username_input.setAttribute("type", "text");
            username_input.setAttribute("id", "username_input");
            

            // Email field
            let email_label = document.createElement("label");
            email_label.classList.add("form-label");
            email_label.innerHTML = "Mail";

            let email_input = document.createElement("input");
            email_input.classList.add("form-control");
            email_input.setAttribute("type", "email");
            email_input.setAttribute("id", "email_input");

            // Password field
            let password_label = document.createElement("label");
            password_label.classList.add("form-label");
            password_label.innerHTML = "Password (If you want to change it else leave it blank) (Optional | Min 8 characters | Max 20 characters)";

            let password_input = document.createElement("input");
            password_input.classList.add("form-control");
            password_input.setAttribute("type", "password");
            password_input.setAttribute("id", "password_input");

            // Select user field or username field based on user level
            let select_users_label = document.createElement("label");
            select_users_label.classList.add("form-label");
            let select_users = null, input_users = null;

            if (localstore.getItem('userLevel') >= 10) {
                select_users_label.innerHTML = "Select user";
                select_users = document.createElement("select");
                select_users.classList.add("form-select");
                select_users.setAttribute("aria-label", "Default select example");
                select_users.setAttribute("id", "select_users");
            }

            // Submit button
            let submit_button = document.createElement("button");
            submit_button.classList.add("btn", "btn-primary");
            submit_button.setAttribute("type", "submit");
            submit_button.innerHTML = "Update";

            // Adding elements to form
            if (select_users) {
                form_users.appendChild(select_users_label);
                form_users.appendChild(select_users);
            }

            form_users.appendChild(username_label);
            form_users.appendChild(username_input);
            

            form_users.appendChild(email_label);
            form_users.appendChild(email_input);
            
            form_users.appendChild(password_label);
            form_users.appendChild(password_input);

            let col_submit_button = document.createElement("div");
            col_submit_button.classList.add("col-12");
            col_submit_button.appendChild(submit_button);
            form_users.appendChild(col_submit_button);

            container.appendChild(form_users);

            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${localstore.getItem("token")}`);

            fetch("http://localhost/api/v2/users", {
                method: 'POST',
                headers: myHeaders,
                redirect: 'follow'
            })
            .then(response => response.text())
            .then(res => {
                let response = JSON.parse(res);
                if (response.status == 200) {
                    let users = response.data.users;
                    let usersData = [];
                    if (select_users) {
                        users.forEach(user => {
                            console.log(user);
                            let option = document.createElement("option");
                            option.setAttribute("value", user.email);
                            option.innerHTML = `${user.username} - ${user.email}`
                            select_users.appendChild(option);
                            
                            usersData.push(user);    
                        });
                    }
                    
                    
                    let username_input = document.getElementById("username_input");
                    let email_input = document.getElementById("email_input");

                    console.log(username_input);
                    if (select_users) {
                        select_users.addEventListener("change", (e) => {
                            let user = usersData.find(user => user.email == e.target.value);
                            username_input.value = user.username;
                            email_input.value = user.email;
                        });
                    }   
                } else {
                    let username_input = document.getElementById("username_input");
                    let email_input = document.getElementById("email_input");
                    username_input.value = localstore.getItem("username");
                    email_input.value = localstore.getItem("e");
                }

            })
            .catch(error => console.log('error', error));

            form_users.addEventListener("submit", (e) => {
                e.preventDefault();
                let email = select_users ? select_users.value : input_users.value;
                let new_email = email_input.value;
                let password = password_input.value;
                let username = username_input.value;

                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${localstore.getItem("token")}`);	

                var raw = JSON.stringify({
                    "email": email,
                    "new_email": new_email,
                    "password": password,
                    "usr": username
                });

                fetch("http://localhost/api/v2/edituser", {
                    method: 'PUT',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                }).then(response => response.text())
                .then(res => {
                    let response = JSON.parse(res);
                    if (response.status == 200) {
                        console.log(response);
                        Swal.fire({
                            title: "Success",
                            text: "User updated",
                            icon: "success",
                            confirmButtonText: "Ok"
                        });
                    } else {
                        Swal.fire({
                            title: "Error",
                            text: response.message,
                            icon: "error",
                            confirmButtonText: "Ok"
                        });
                    }
                })
                .catch(error => console.log('error', error));
            });
            
            
            
            dashboard.appendChild(container);
            break;
        default:
            break;
    }
}

let shortener = document.getElementById("shortener");
shortener.addEventListener("click", (e) => {
    let url = document.getElementById("url_inputbox").value;
    
    var formdata = new FormData();
    formdata.append("url", url);

    fetch("http://localhost/api/v1/new", {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    })
    .then(response => response.text())
    .then(res => {
        res = JSON.parse(res);
        console.log(res.data);
        if (res.status == 200) {
            Swal.fire({
                title: 'Link created successfully',
                icon: 'success',
                html: "Your code is: " + '<br> <a href=' + res.data.short_link + '>' + res.data.short_link + '</a>',
                confirmButtonText: "Ok",
                icon: "success",
                confirmButtonText: "Ok"
            }).then((result) => {
                console.log(result);
            });
        }
    })
    .catch(error => console.log('error', error));
});

logout = function() {
    lstorage = window.localStorage;
    lstorage.clear();
    removeDashboardPage();
    changeNavbarAuth();
    addMainPage();

}