<?php

/* @var $this yii\web\View */
/* @var $todos array */

use app\assets\TodoAsset;
use yii\helpers\Json;

TodoAsset::register($this);

$this->title = 'Todos';

$this->registerJs("var phpTodos = " . Json::encode($todos) . ";",  \yii\web\View::POS_HEAD);
?>

<section class="todoapp">
    <header class="header">
        <h1>todos</h1>
        <input class="new-todo" id="new-todo" placeholder="What needs to be done?" autofocus>
    </header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox" checked="checked">
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list" id="tag-list">
            <!-- These are here just to show the structure of the list items -->
            <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        </ul>
    </section>
    <!-- This footer should hidden by default and shown when there are todos -->
    <footer class="footer" id="tag-footer" <?= empty($todos) ? 'style="display: none"' : '' ?>  >
        <!-- This should be `0 items left` by default -->
        <span class="todo-count"><strong id="todo-count">0</strong> item left</span>
        <!-- Remove this if you don't implement routing -->
        <ul class="filters">
            <li>
                <a class="selected" href="#/" id="tag-footer-all">All</a>
            </li>
            <li>
                <a href="#/active" id="tag-footer-active">Active</a>
            </li>
            <li>
                <a href="#/completed" id="tag-footer-completed">Completed</a>
            </li>
        </ul>
        <!-- Hidden if no completed items are left ↓ -->
        <button class="clear-completed">Clear completed</button>
    </footer>
</section>
<footer class="info">
    <p>Double-click to edit a todo</p>
    <!-- Remove the below line ↓ -->
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <!-- Change this out with your name and url ↓ -->
    <p>Created by <a href="http://todomvc.com">you</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>
<!-- Scripts here. Don't remove ↓ -->