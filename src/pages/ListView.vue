<template>
    <div class="container">
        <div class="card mt-3">
            <div class="card-header">
                Todo List
                <button class="btn btn-success bt-write" @click="writeTodo()">글쓰기</button>
                <!-- 검색필드 -->
                <div class="input-group mr-2 search">
                    <input 
                        class="form-control" 
                        placeholder="검색어를 입력하세요."
                        v-model="searchTxt"
                        @keyup.enter = "getTotalSearch()"
                    >
                </div>
            </div>
            <div class="card-body">
                <table class="table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Title</th>
                            <th>Complete</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in todos" :key="item.id">
                            <td>{{index + 1}}</td>
                            <td><span @click="moveDetail(item.id)" class="detail">{{item.title}}</span></td>
                            <td>
                                <input type="checkbox" class="ml-2 mr-2" :id="item.id" v-model="item.active" @change="toggleTodo(item)">
                                <span class="form-check-label" :class="item.active == false ? 'active-ch' : 'active-complete'">
                                    {{item.active ? "완료": "진행중"}}
                                </span>
                            </td>
                            <td>
                                <div class="btn-group" role="group">
                                    <button class="btn btn-primary" @click="editTodo(item.id)">수정</button>
                                    <button class="btn btn-danger" @click="openModal(item.id)">삭제</button>
                                </div>    
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <nav aria-label="Page navigation example" class="mt-3" v-show="page_total > 1">
            <ul class="pagination">
                <!-- 현재 페이지가 1페이지라면 보일 필요 없다 -->
                <li class="page-item" v-show="page_now != 1">
                    <!-- 이전페이지 (page_now - 1) -->
                    <a class="page-link" href="#" @click="getInfo(page_now - 1)">
                        Previous
                    </a>
                </li>
                <li class="page-item" v-for="item in page_total" :key="item">
                    <a class="page-link" href="#" @click="getInfo(item)" :class="page_now == item ? 'active' : ''">
                        {{item}}
                    </a>
                </li>

                <!-- 현재 페이지가 마지막 페이지라면 보일 필요 없다 -->
                <li class="page-item" v-show="page_now != page_total">
                    <!-- 다음페이지 (page_now + 1) -->
                    <a class="page-link" href="#" @click="getInfo(page_now + 1)">
                    Next
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    <!-- 경고창 -->
    <ModalWindow
        v-if="showModal"
        @close="closeModal()"
        @delete="deleteTodo()"
    />
</template>

<script>
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router'
import ModalWindow from '@/components/ModalWindow.vue'

    export default {
        components: {
            ModalWindow
        },
        setup() {
            // 현재 생성된 목록이 검색으로 된 것인지
            // 아니면 검색없이 일반적인 목록인지 구분하는 변수를 하나 만들자.
            const searchActive = ref(false);

            const todos = ref([]);

            // 직접 구현하는 페이지네이션
            // 전체데이터 개수
            const data_total = ref(0);
            // 페이지당 보여줄 개수
            const data_count = 5;
            // 총 페이지 수
            const page_total = ref(0);
            // 현재 페이지
            const page_now = ref(1);

            // 서버에서 자료를 읽어오기
            const getInfo = (_page = 1) => {
                page_now.value = _page;
                if(searchActive.value == true){
                    // 검색 중이다.
                    searchTodo(page_now.value);
                    return;
                }
                fetch(`http://manzana.dothome.co.kr/data_read.php?page_now=${page_now.value}&data_count=${data_count}`)
                    .then(res => res.json())
                    .then(data => {
                        todos.value = data.result;
                        // todos의 종류는 배열이다.
                        // 배열의 for를 이용해 접근해서
                        // 만약에 각 배열의 Complete가 0, 1이냐에 따라서 
                        // 그 값을 반영하는 객체를 추가한다.
                        for(let item of todos.value) {
                            if(item.complete === '0'){
                                item.active = false;
                            }else{
                                item.active = true;
                            }
                        }
                    })
                    .catch()
            }
            getInfo();

            // 모달창 닫기
            // 모달이 보여지는 상태를 저장한다.
            const showModal = ref(false);
            // 선택된 아이디를 저장한다.
            const deleteId = ref(null);
            const closeModal = () => {
                // 모달창 숨기기
                showModal.value = false;
                deleteId.value = null;
            }

            // 모달창 보여주기
            const openModal = (_id) => {
                // 삭제해야 하는 아이디 저장
                deleteId.value = _id;
                // 모달을 보여주고
                showModal.value = true;
            }

            // 할일 삭제
            const deleteTodo = () => {
                fetch(`http://manzana.dothome.co.kr/data_delete.php?id=${deleteId.value}`)
                .then(res => res.json())
                .then(data => {
                        // 목록갱신
                        if(data.result == 1) {
                            // 모달 닫기
                            showModal.value = false;
                            deleteId.value = null;
                            getInfo();
                        }else{
                            console.log('삭제에 실패했습니다.');
                        }
                    });
                }

            // 상태 업데이트
            const toggleTodo = (_obj) => {
                if(_obj.active == true) {
                    _obj.complete = 1;
                }else{
                    _obj.complete = 0;
                }
                fetch(`http://manzana.dothome.co.kr/data_update.php?id=${_obj.id}&title=${_obj.title}&body=${_obj.body}&complete=${_obj.complete}`)
                .then(res => res.json())
                .then(data => {
                        if(data.result == 1) {
                            console.log(data);
                        }else{
                            console.log('업데이트에 실패했습니다.');
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

            // 수정하기
            const editTodo = (_id) => {
                router.push({
                    name: 'Update',
                    params: { id: _id }
                });
            }

            // 글쓰기
            const writeTodo = () => {
                router.push({
                    name: 'Create'
                    // id는 전달할 필요는 없다
                });
            }

            // 전체 데이터 수 받아오기 
            const getTotal = () => {
                fetch(`http://manzana.dothome.co.kr/data_total.php`)
                .then(res => res.json())
                .then(data => {
                    // 전체 데이터 수 갱신
                    data_total.value = data.total;

                    // 전체 페이지 갱신 
                    page_total.value = Math.ceil(data_total.value / data_count);
                    page_now.value = 1;
                    getInfo(); 
                })
                .catch();
            }
            getTotal();

            
            // 검색 기능 구현
            const searchTxt = ref('');
            // 잦은 검색 php 요청을 하는 것을 방지하는 용도
            // 일정시간 딜레이를 줘서 php 부하를 줄여주는 용도
            let searchTimer = null;
            // searchTxt가 변하는 것을 감시합니다.
            watch(searchTxt, () => {
                if(searchTxt.value !== '') {
                    searchActive.value = true;
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(() => {
                        // 검색어와 동일한 내용을 php를 이용해서 
                        // 전체 개수를 파악한다. (data_total_search.php)
                        getTotalSearch();
                    }, 2000);
                }else{
                    // 일반적인 목록이다
                    searchActive.value = false;
                    getTotal();
                }
            });

            // 검색에 해당하는 총 목록 개수를 가지고 온다.
            const getTotalSearch = () => {
                clearTimeout(searchTimer);
                fetch(`http://manzana.dothome.co.kr/data_total_search.php?title=${searchTxt.value}`)
                .then(res => res.json())
                .then(data => {
                    // 검색어에 해당하는 데이터 개수
                    data_total.value = data.total;
                    // 몇 페이지인가?
                    page_total.value = Math.ceil(data_total.value / data_count);
                    // 시작 페이지는 1페이지로 세팅
                    page_now.value = 1;
                    // 실제 내용 가져오기를 진행시킨다.
                    searchTodo();
                })
                .catch();
            }

            const searchTodo = () => {
                fetch(`http://manzana.dothome.co.kr/data_read_search.php?page_now=${page_now.value}&data_count=${data_count}&title=${searchTxt.value}`)
                .then(res => res.json())
                .then(data => {
                    // 검색된 배열을 받아서 todos를 업데이트 한다.
                    todos.value = data.result;
                    // complete를 '0'
                    for (let item of todos.value) {
                        if(item.complete === '0') {
                            item.active = false;
                        }else {
                            item.active = true;
                        }
                    }
                })
                .catch();
            }

            return {
                todos,
                getInfo,
                deleteTodo,
                moveDetail,
                editTodo,
                writeTodo,
                getTotal,
                page_total,
                page_now,
                closeModal,
                openModal,
                showModal,
                toggleTodo,
                searchTxt,
                getTotalSearch
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

.card-header button {
    position: reactive;
    float: right;
}

.active {
    background-color: #007bff;
    color: #fff;
}

.active-ch {
    background-color: #ffa922;
    color: #fff;
    padding: 5px;
    border-radius: 10px;
}

.active-complete {
    background-color: #007bff;
    color: #fff;
    padding: 5px;
    border-radius: 10px;
}

.search {
    width: 50%;
    float: right;
}
</style>