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

            //ФИЛЬТРЫ
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
                    if (!tag.hasClass('completed')) {
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

            //ПЕРЕРАСЧЕТ КОЛИЧЕСТВА АКТИВНЫХ СТРОК
            function recountTodoCount() {
                tagListFieldLength = tagListField.find('li').not('.completed').length;
                tagForm.find('#todo-count').html(tagListFieldLength);
                if (tagListFieldLength > 0) {
                    $('#tag-footer').show();
                } else {
                    $('#tag-footer').hide();
                }
            }

            //ЗАПОЛНЕНИЕ ТАБЛИЦЫ
            setTimeout(updateTags, 0);

            function updateTags() {
                tagListField.html('');
                $.each(phpTodos, function (i, val) {
                    addTag(val['id'], val['name'], val['state']);
                });
                if (!phpTodos.length) {
                    recountTodoCount();
                }
                tagListField.find('li').each(function () {
                    tag = $(this);
                    if (!tag.hasClass('completed')) {
                        $('#toggle-all')[0].checked = false;
                    }
                });
            }

            function addTag(id, name, state) {
                var checked = (state == 'completed') ? 'checked="checked"' : '';
                var classState = (state == 'completed') ? 'completed' : '';
                var tag = $(
                    '<li class="' + classState + '" data-id=' + id + '>' +
                        '<div class="view">' +
                            '<input class="toggle" type="checkbox" ' + checked + '>' +
                            '<label>' + name + '</label>' +
                            '<button class="destroy"></button>' +
                        '</div>' +
                        '<input class="edit" value="' + name + '">' +
                    '</li>'
                );

                tagListField.append(tag);
                recountTodoCount();
            }

            function showWarningAlert() {
                alert('Произошла ошибка, перезагрузите страницу')
            }

            //УДАЛЕНИЕ СТРОК
            tagListField.on('click', '.destroy', function () {
                removeTag($(this).closest('li'));
            });

            function removeTag(tag) {
                todoApp.addClass('loading-overlay');
                $.post('/todo/remove', {
                    tagId: tag.data('id')
                }).done(function (response) {
                    if (response.success) {
                        tag.remove();
                    } else {
                        console.log(response.message);
                        showWarningAlert();
                    }
                }).fail(function () {
                    showWarningAlert();
                }).always(function () {
                    todoApp.removeClass('loading-overlay');
                    recountTodoCount();
                });

            }

            //ИЗМЕНЕНИЕ СТАТУСА ОДНОЙ ЗАПИСИ
            tagListField.on("click", "input.toggle:checkbox", function (e) {
                var checkBox = $(this);
                var state = this.checked ? 'completed' : 'view';
                if (this.checked) {
                    $(this)[0].checked = true;
                    $(this).closest('li').addClass('completed');
                } else {
                    $(this)[0].checked = false;
                    $(this).closest('li').removeClass('completed');
                }
                recountTodoCount();
                changeState([checkBox.closest('li').data('id')], state);
                if (tagListField.find('li.completed').length == 0) {
                    $('#toggle-all')[0].checked = false;
                } else if (tagListField.find('li:not(.completed)').length == 0) {
                    $('#toggle-all')[0].checked = true;
                }
            });

            function changeTag(id, name, state) {
                var tag = $('li[data-id="'+id+'"]');
                recountTodoCount();
            }

            //ИЗМЕНЕНИЕ СТАТУСА ВСЕХ ЗАПИСЕЙ
            $('#toggle-all').change(function () {
                var toggleAllChecked = this.checked;
                var checkedInput = tagListField.find('li input.toggle:not(:checked)');
                var notcheckedInput = tagListField.find('li input.toggle:checked');
                var tagIds = [];
                if (toggleAllChecked && checkedInput.length > 0) {
                    checkedInput.closest('li').each(function (i, val) {
                         tagIds.push($(val).data('id'));
                     });
                    $.each(checkedInput, function (i, val) {
                        val.checked = true;
                    });
                    checkedInput.closest('li').addClass('completed');
                } else if (notcheckedInput.length > 0) {
                    notcheckedInput.closest('li').each(function (i, val) {
                        tagIds.push($(val).data('id'));
                    });
                    $.each(notcheckedInput, function (i, val) {
                        val.checked = false;
                    });
                    notcheckedInput.closest('li').removeClass('completed');
                }
                if (tagIds != 0) {
                    recountTodoCount();
                    changeState(tagIds, toggleAllChecked ? 'completed' : 'view')
                }
            });

            function changeState(tagIds, state) {
                todoApp.addClass('loading-overlay');
                $.post('/todo/change-state', {
                    tagIds: tagIds,
                    state: state
                }).done(function (response) {
                    if (response.success) {

                    } else {
                        console.log(response.message);
                        showWarningAlert();
                    }
                }).fail(function () {
                    showWarningAlert();
                }).always(function () {
                    todoApp.removeClass('loading-overlay');
                });
            }

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
                            addTag(response.id, response.name, response.state);
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