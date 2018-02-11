<?php

use yii\db\Migration;

/**
 * Class m180211_124431_add_state_column
 */
class m180211_124431_add_state_column extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->execute("ALTER TABLE todo ADD COLUMN state ENUM(\"view\", \"completed\") NOT NULL");
        $this->execute("UPDATE todo SET state = 'view'");
        $this->execute("ALTER TABLE todo ALTER state SET DEFAULT 'view'");
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        return false;
    }
}
