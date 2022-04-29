<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                Todo Detail Edit
            </div>
            <div class="card-body">
                <h4 class="card-title">{{todo.title}}</h4>
                <p class="card-text">{{todo.body}}</p>
                <div class="btn-group" role="group" aria-label="">
                    <button type="button" class="btn btn-primary" @click="editTodo(todo.id)">수정</button>
                    <button type="button" class="btn btn-danger" @click="deleteTodo(todo.id)">삭제</button>
                    <button type="button" class="btn btn-secondary" @click="moveList()">목록</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
    export default {
        setup() {
            const route = useRoute();
            // 타이틀
            const todo = reactive({
                title: '',
                body: '',
                id: 0,
                complete: 0
            });
            console.log(route.params.id);
            // 아이디를 전달하고 자료를 받아온다.
            const getInfo = () => {
                fetch(`http://manzana.dothome.co.kr/data_read_id.php?id=${route.params.id}`)
                .then(res => res.json())
                .then(data => {
                    todo.title = data.result[0].title;
                    todo.body = data.result[0].body;
                    todo.complete = data.result[0].complete;
                    todo.id = data.result[0].id;
                })
                .catch()
            }
            getInfo();

            // 할일 삭제 
            const router = useRouter();
            const deleteTodo = (_id) => {
                // console.log(_id);
                fetch(`http://webd2020.dothome.co.kr/data_delete.php?id=${_id}`)
                .then(res => res.json())
                .then(data => {
                    if(data.result == 1) {
                        router.push({
                            name: 'List'
                        });
                    }else{
                        console.log('삭제에 실패했습니다');
                    }        
                })
                .catch()
            }
                        
            // 수정하기
            const editTodo = (_id) => {
                router.push({
                    name: 'Update',
                    params: { id: _id }
                });
            }

            // 목록으로 이동
            const moveList = () => {
                router.push({
                    name: 'Create'
                });
            }

            return{
                getInfo,
                todo,
                deleteTodo,
                editTodo,
                moveList
            }
        }
    }
</script>

<style>

</style>