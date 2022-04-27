<template>
    <div class="container">
        <div class="card">
            <div class="card-header">
                Todo List
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Title</th>
                            <th>Complete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in todos" :key="item.id">
                            <td>{{index + 1}}</td>
                            <td><span @click="moveDetail(item.id)" class="detail">{{item.title}}</span></td>
                            <td>{{item.complete}}</td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-primary">편집</button>
                                    <button class="btn btn-danger" @click="deleteTodo(item.id)">삭제</button>
                                </div>    
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import {ref} from 'vue';
import {useRouter} from 'vue-router'
    export default {
        setup() {
            const todos = ref([]);
            // 서버에서 자료를 읽어오기
            const getInfo = () => {
                fetch('http://manzana.dothome.co.kr/data_read.php')
                    .then(res => res.json())
                    .then(data => {
                        todos.value = data.result;
                    })
                    .catch()
            }
            getInfo();

            // 할일 삭제
            const deleteTodo = (_id) => {
                fetch(`http://manzana.dothome.co.kr/data_delete.php?id=${_id}`)
                .then(res => res.json())
                .then(data => {
                        console.log(data);
                        // 목록갱신
                        if(data.result == 1) {
                            getInfo();
                        }else{
                            console.log('삭제에 실패했습니다.')
                        }
                    });
                }

                // 상세보기 기능
                const router = useRouter();
                const moveDetail = (_id) => {
                    // console.log(_id);
                    router.push({
                        name: 'Detail',
                        params: {
                            id: _id
                        }
                    });
                }

            return {
                todos,
                deleteTodo,
                moveDetail
            }
    }

}
</script>

<style>
.detail {
    text-decoration: underline;
    color: #000;
    cursor: pointer;
}
.detail:hover {
    color: skyblue;
}
</style>