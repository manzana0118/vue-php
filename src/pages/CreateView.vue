<template>
    <div class="container">
        <div class="card mt-3">
            <div class="card-header">
                Todo Create
            </div>
            <div class="card-body">
                <form @submit.prevent="onSubmit">
                    <div class="form-group">
                        <label for="title">제목</label>
                        <input type="text" v-model="todo.title" class="form-control" name="title" id="title" aria-describedby="helpId"
                            placeholder="">
                        <small id="helpId" class="form-text text-muted">제목을 입력하세요.</small>
                    </div>
                    <div class="form-group">
                        <label for="body">내용</label>
                        <textarea class="form-control" v-model="todo.body" name="body" id="body" rows="3"></textarea>
                        <small id="helpId" class="form-text text-muted">내용을 입력하세요.</small>
                    </div>
                    <div class="btn-group" role="group">
                        <button type="submit" class="btn btn-primary">확인</button>
                        <button type="button" class="btn btn-danger" @click="moveList()">취소</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/toast.js'

    export default {
        setup(){
            const router = useRouter();

            // 값이 변하는 것을 계속 유지해 준다.
            const todo = reactive({
                title: '',
                body: ''
            });

            // 안내창
            const {
                toastMessage,
                toastShow,
                triggerToast
            } = useToast();

            const onSubmit = () => {
                // 제목 없으면 생성 금지
                if (!todo.title) {
                    triggerToast('제목을 입력하세요.');
                    return;
                }
                // 내용이 없으면 생성 금지
                if (!todo.body) {
                    triggerToast('내용을 입력하세요.');
                    return;
                }
                fetch(`http://manzana.dothome.co.kr/data_add.php?title=${todo.title}&body=${todo.body}`)
                .then(res => res.json())
                .then(data => {
                    if(data.result == 1) {
                        // List 화면으로 이동한다.
                        router.push({
                            name: 'List'
                        });
                    }else{
                        console.log("서버에서 자료가 오지 않았어요.")
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
                triggerToast
            }
        }
    }
</script>

<style>

</style>