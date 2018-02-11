/**
 * Created by Khakimov Ildar on 11.02.2018.
 */

$(function () {
    $.fn.todoTags = function (options) {

        return this.each(tagger);

        function tagger() {
            var tagForm = $(this);
            var todoApp = $('.todoapp');
            var tagListField = tagForm.find('#tag-list');
            var footer = tagForm.find('#tag-footer');
            var footerAll = footer.find('#tag-footer-all');
            var footerActive = footer.find('#tag-footer-active');
            var footerCompleted = footer.find('#tag-footer-completed');

            tagListField.on('click', '.destroy', function () {
                removeTag($(this).closest('li'));
            });

            footerAll.click(function () {
                tagListField.find('li').each(function () {
                    $(this).show();
                });
                footerAll.addClass('selected');
                footerActive.removeClass('selected');
                footerCompleted.removeClass('selected');
            });

            footerActive.click(function () {
                tagListField.find('li').each(function () {
                    tag = $(this);
                    if (tag.hasClass('view')) {
                        tag.show();
                    } else {
                        tag.hide();
                    }
                });
                footerAll.removeClass('selected');
                footerActive.addClass('selected');
                footerCompleted.removeClass('selected');

            });

            footerCompleted.click(function () {
                tagListField.find('li').each(function () {
                    tag = $(this);
                    if (tag.hasClass('completed')) {
                        tag.show();
                    } else {
                        tag.hide();
                    }
                });
                footerAll.removeClass('selected');
                footerActive.removeClass('selected');
                footerCompleted.addClass('selected');
            });

            setTimeout(updateTags, 0);

            function updateTags() {
                tagListField.html('');
                $.each(phpTodos, function (i, val) {
                    addTag(val['id'], val['name'], val['state']);
                });
                recountTodoCount();
            }

            function recountTodoCount() {
                tagForm.find('#todo-count').html(tagListField.find('li').not('.completed').length);
            }

            function addTag(id, name, state) {
                var checked = (state == 'completed') ? 'checked' : '';
                var classState = (state == 'completed') ? 'completed' : '';
                var tag = $(
                    '<li class="' + classState + '" data-id=' + id + '>' +
                        '<div class="view">' +
                            '<input class="toggle" type="checkbox"' + checked + '>' +
                            '<label>' + name + '</label>' +
                            '<button class="destroy"></button>' +
                        '</div>' +
                        '<input class="edit" value="' + name + '">' +
                    '</li>'
                );

                tagListField.append(tag);
                recountTodoCount();
            }

            function changeTag(id, name, state) {
                var tag = $('li[data-id="'+id+'"]');


                recountTodoCount();
            }

            tagListField.on("change", "input.toggle:checkbox", function (e) {
                if (this.checked) {
                    $(this).closest('li').addClass('completed');
                } else {
                    $(this).closest('li').removeClass('completed');
                }
            });

            function showWarningAlert() {
                alert('Произошла ошибка, перезагрузите страницу')
            }

            //УДАЛЕНИЕ ОДНОЙ ЗАПИСИ
            function removeTag(tag) {
                tag.remove();
                recountTodoCount();
            }

            //ИЗМЕНЕНИЕ СТАТУСА ОДНОЙ ЗАПИСИ
            tagListField.on("click", "input.toggle:checkbox", function (e) {
                var checkBox = $(this);
                var state = 'view';
                todoApp.addClass('loading-overlay');
                if (this.checked) {
                    state = 'completed';
                }
                $.post('/todo/change-state', {
                    id: checkBox.closest('li').data('id'),
                    state: state
                }).done(function (response) {
                    if (response.success) {
                        changeTag(response.id, response.name, response.state)
                    } else {
                        console.log(response.message);
                        showWarningAlert();
                    }
                }).fail(function () {
                    showWarningAlert();
                }).always(function () {
                    todoApp.removeClass('loading-overlay');
                });
            });

            //НОВАЯ ЗАПИСЬ
            $("#new-todo").keyup(function (event) {
                if (event.keyCode == 13) {
                    var newTodo = $(this);
                    todoApp.addClass('loading-overlay');
                    $.post('/todo/add', {
                        name: newTodo.val()
                    }).done(function (response) {
                        newTodo.val('');
                        if (response.success) {
                            addTag(response.id, response.name, response.state)
                        } else {
                            console.log(response.message);
                            showWarningAlert();
                        }
                    }).fail(function () {
                        showWarningAlert()
                    }).always(function () {
                        todoApp.removeClass('loading-overlay');
                    });
                }
            });
        }
    }
});