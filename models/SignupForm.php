<?php
/**
 * Created by PhpStorm.
 * User: Viloborod
 * Date: 11.02.2018
 * Time: 15:57
 */

namespace app\models;

use Yii;
use yii\base\Model;
use app\models\dtdl\User;


/**
 * Signup form
 */
class SignupForm extends Model
{

    public $username;
    public $email;
    public $password;

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            ['username', 'trim'],
            ['username', 'required', 'message'=>'Поле необходимо заполнить'],
            ['username', 'unique', 'targetClass' => '\app\models\dtdl\User', 'message' => 'Имя пользователя уже существует'],
            ['username', 'string', 'min' => 2, 'max' => 255],
            ['email', 'trim'],
            ['email', 'required', 'message'=>'Поле необходимо заполнить'],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
            ['email', 'unique', 'targetClass' => '\app\models\dtdl\User', 'message' => 'Этот email уже используется'],
            ['password', 'required', 'message' => 'Поле необходимо заполнить'],
            ['password', 'string', 'min' => 3, 'message' => 'Пароль должен содержать не менее 3 знаков'],
        ];
    }

    /**
     * Signs user up.
     *
     * @return User|null the saved model or null if saving fails
     */
    public function signup()
    {

        if (!$this->validate()) {
            return null;
        }

        $user = new User();
        $user->username = $this->username;
        $user->email = $this->email;
        $user->setPassword($this->password);
        $user->generateAuthKey();
        return $user->save() ? $user : null;
    }

}