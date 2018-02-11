<?php

namespace app\models\dtdl;

use Yii;

/**
 * This is the model class for table "todo".
 *
 * @property int $id
 * @property string $name
 * @property int $user_id
 * @property string $state
 *
 * @property User $user
 */
class Todo extends \yii\db\ActiveRecord
{

    const STATE_VIEW = 'view';
    const STATE_COMPLETED = 'completed';

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'todo';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name', 'user_id'], 'required'],
            [['name', 'state'], 'string'],
            [['user_id'], 'integer'],
            [['user_id'], 'exist', 'skipOnError' => true, 'targetClass' => User::className(), 'targetAttribute' => ['user_id' => 'id']],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'user_id' => 'User ID',
            'state' => 'State',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(User::className(), ['id' => 'user_id']);
    }
}
