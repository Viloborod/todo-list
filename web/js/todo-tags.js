/**
 * Created by Khakimov Ildar on 11.02.2018.
 */

$(function () {
    $.fn.todoTags = function (options) {

        return this.each(tagger);

        function tagger() {
            var tagForm = $(this);
            var tagList = tagForm.find('#tag-list');

            tagList.on('click', '.destroy', function () {
                removeTag($(this).closest('li'));
            });

            setTimeout(updateTags, 0);

            function updateTags() {
                tagList.html('');
                $.each(todos, function (i, val) {
                    addTag(val['id'], val['name'], val['state']);
                });
            }

            function addTag(id, text, state) {
                var tag = $(
                    '<li class="' + state + '" data-id="' + id + '">' +
                        '<div class="view">' +
                            '<input class="toggle" type="checkbox" checked>' +
                            '<label>' + text + '</label>' +
                            '<button class="destroy"></button>' +
                        '</div>' +
                        '<input class="edit" value="' + text + '">' +
                    '</li>'
                );

                tagList.append(tag);
            }

            function removeTag(tag) {
                tag.remove();
            }
        }
    }
});