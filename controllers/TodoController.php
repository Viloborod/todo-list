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

    public function actionAdd() {
        \Yii::$app->response->format = Response::FORMAT_JSON;

        /** @var User $user */
        $user = Yii::$app->user->identity;
        $todo = new Todo();
        $todo->user_id = $user->id;
        if ($todo->load(\Yii::$app->request->post(),'') && $todo->validate()) {
            try {
                $todo->save(false);
                return $response = [
                    'success' => true,
                    'id' => $todo->id,
                    'name' => $todo->name,
                    'state' => $todo::STATE_VIEW,
                ];
            } catch (\Exception $e) {
                \Yii::error($e, __METHOD__);
                return $response = [
                    'success' => false,
                    'message' => 'не удалось сохранить в БД'
                ];
            }
        };
        return $response = [
            'success' => false,
            'message' => 'Нет данных или данные не верны'
        ];
    }

    public function actionRemove() {
        \Yii::$app->response->format = Response::FORMAT_JSON;

        /** @var User $user */
        $user = Yii::$app->user->identity;
        $todoId = \Yii::$app->request->post('tagId');
        $todo = Todo::find()
            ->andWhere(['id' => $todoId])
            ->andWhere(['user_id' => $user->id])
            ->one();
        if ($todo) {
            try {
                $todo->delete();
            } catch (\Exception $e) {
                \Yii::error($e, __METHOD__);
                return $response = [
                    'success' => false,
                    'message' => 'не удалось удалить из БД'
                ];
            }
        } else {
            return $response = [
                'success' => false,
                'message' => 'Нет данных или данные не верны'
            ];
        }
        return $response = [
            'success' => true,
        ];
    }

    public function actionChangeState() {
        \Yii::$app->response->format = Response::FORMAT_JSON;
        /** @var User $user */
        $user = Yii::$app->user->identity;
        $todoIds = \Yii::$app->request->post('tagIds');
        $state = \Yii::$app->request->post('state');

        foreach ($todoIds as $todoId) {
            $todo = Todo::find()
                ->andWhere(['id' => $todoId])
                ->andWhere(['user_id' => $user->id])
                ->one();
            if ($todo && $todo->state != $state) {
                $todo->state = $state;
                try {
                    $todo->save(false);
                } catch (\Exception $e) {
                    \Yii::error($e, __METHOD__);
                    return $response = [
                        'success' => false,
                        'message' => 'не удалось сохранить в БД'
                    ];
                }
            } else {
                return $response = [
                    'success' => false,
                    'message' => 'Нет данных или данные не верны'
                ];
            }
        }
        return $response = [
            'success' => true,
        ];
    }
}
