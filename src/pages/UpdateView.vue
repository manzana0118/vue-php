<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                Todo Update
            </div>
            <div class="card-body">
                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="title">제목</label>
                        <input type="text" class="form-control form-control-sm" name="title" id="title"
                            aria-describedby="helpId" placeholder="" v-model="todo.title">
                        <small id="helpId" class="form-text text-muted">제목을 입력하세요.</small>
                    </div>

                    <div class="form-group">
                        <label for="body">내용</label>
                        <textarea class="form-control" name="body" id="body" rows="3" v-model="todo.body"></textarea>
                        <small id="helpId" class="form-text text-muted">내용을 입력하세요.</small>
                    </div>

                    <div class="form-group">
                        <label>완료여부</label>
                        <input type="checkbox" class="ml-2 mr-2" :id="todo.id" v-model="todo.active" @change="toggleTodo()">
                        <span class="form-check-label" :class="todo.active == false ? 'active-ch' : 'active-complete'">
                            {{todo.active ? "완료": "진행중"}}
                        </span>
                    </div>

                    <div class="btn-group" role="group" aria-label="">
                        <button type="submit" class="btn btn-danger" :disabled = "todoUpdate">확인</button>
                        <button type="button" class="btn btn-primary" @click="moveList()">취소</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import {reactive, computed } from 'vue'
    import {useRoute,useRouter} from 'vue-router'
    import _ from 'lodash'
    import { useToast } from '@/composables/toast.js'

    export default {
        setup() {
            // 자료가져오기(data_read_id.php 실행)
            // 현재의 화면에 보여지는 자료
            const todo = reactive({
                title: '',
                complete: false,
                body: '',
                id: 0
            });

            // 원본값 (비교를 위한)
            const originalTodo = reactive({
                title: '',
                complete: false,
                body: '',
                id: 0,
                active: false
            });

            // todo와 originalTodo를 비교한다.
            // 그 결과가 true인지 false인지 비교한다.
            const todoUpdate = computed(() => {
                return _.isEqual(todo, originalTodo);
            });

            const route = useRoute();
            const getInfo = () => {
                console.log(route.params.id)
                fetch(`http://manzana.dothome.co.kr/data_read_id.php?id=${route.params.id}`)
                    .then(res => res.json())
                    .then(data => {
                        // 현재 화면에 보일 값, 갱신되는 값 보관용
                        todo.title = data.result[0].title;
                        todo.body = data.result[0].body;
                        todo.complete = data.result[0].complete;
                        todo.id = data.result[0].id;

                        if(todo.complete === '0') {
                            todo.active = false;
                        }else{
                            todo.active = true;
                        }

                        // 원본 보관
                        originalTodo.title = data.result[0].title;
                        originalTodo.body = data.result[0].body;
                        originalTodo.complete = data.result[0].complete;
                        originalTodo.id = data.result[0].id;

                        if(originalTodo.complete === '0') {
                            originalTodo.active = false;
                        }else{
                            originalTodo.active = true;
                        }
                    })
                    .catch()
            }
            getInfo();

            const toggleTodo = () => {
                if(todo.active == true) {
                    todo.complete = '1';
                }else{
                    todo.complete = '0';
                }
            }

            // 안내창
            const {
                toastMessage,
                toastShow,
                triggerToast
            } = useToast();


            // 업데이트
            const router = useRouter();
            const onSubmit = () => {
                // 제목 없으면 업데이트 금지
                if (!todo.title) {
                    triggerToast('제목을 입력하세요.');
                    return;
                }
                // 내용이 없으면 업데이트 금지
                if (!todo.body) {
                    triggerToast('내용을 입력하세요.');
                    return;
                }
                fetch(
                        `http://manzana.dothome.co.kr/data_update.php?id=${todo.id}&title=${todo.title}&body=${todo.body}&complete=${todo.complete}`)
                    .then(res => res.json())
                    .then(data => {
                        // 수정완료 후 DetailView.vue 이동
                        if (data.result == 1) {
                            router.push({
                                name: 'Detail',
                                params: {
                                    id: todo.id
                                }
                            })
                        }
                    })
                    .catch()
            
            }

            // 목록으로 이동
            const moveList = () => {
                router.push({
                    name: 'List'
                });
            }

            return {
                todo,
                onSubmit,
                moveList,
                toastMessage,
                toastShow,
                todoUpdate,
                toggleTodo
            }

        }
    }
</script>

<style>

</style>