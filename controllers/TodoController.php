<?php

namespace app\controllers;

use app\models\dtdl\User;
use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use app\models\LoginForm;
use app\models\SignupForm;
use app\models\dtdl\Todo;

class TodoController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'access' => [
                'class' => AccessControl::className(),
                'only' => ['index'],
                'rules' => [
                    [
                        'actions' => ['index'],
                        'allow' => true,
                        'roles' => ['@'],

                    ],
                ],
                'denyCallback' => function ($rule, $action) {
                    $this->redirect('/site/notice');
                }

            ],
        ];
    }


    public function actionIndex()
    {
        /** @var User $user */
        $user = Yii::$app->user->identity;

        $todos = Todo::find()->where(['user_id' => $user->id])->asArray()->all();
        return $this->render('index', ['todos' => $todos]);
    }
}
