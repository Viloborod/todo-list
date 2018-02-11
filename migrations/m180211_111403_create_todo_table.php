<?php

use yii\db\Migration;

/**
 * Handles the creation of table `todo`.
 */
class m180211_111403_create_todo_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $tableOptions = null;

        if ($this->db->driverName === 'mysql') {
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }

        $this->createTable('todo', [
            'id' => $this->primaryKey(),
            'name' => $this->text()->notNull(),
            'user_id' => $this->integer()->notNull(),
        ], $tableOptions);

        $this->addForeignKey('fk-todo-user_id', 'todo', 'user_id', 'user', 'id');
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropForeignKey(
            'fk-todo-user_id',
            'todo'
        );

        $this->dropTable('todo');
    }
}
