import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from '@/lib/axios'
import { useEffect,useState } from 'react'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home({todos}) {
  const router = useRouter();

  const [title,setTitle] = useState('')
  const [todoid,setTodoId] = useState('')

  const fetchTodos = () =>{
    router.replace(router.asPath)
  }

  const titleChange = (e) =>{
    setTitle(e.target.value)
  }

  const submitForm = (e) =>{
    e.preventDefault()
    var formData = new FormData()
    formData.append('title',title)
    formData.append('is_done',0)
    let url = 'api/todos';

    if(todoid != ''){
      url = 'api/todos/'+todoid;
      formData.append('_method','PUT')
    }

    axios.post(url,formData).then((response)=>{
      setTitle('')
      fetchTodos()
      setTodoId('')
    })
  }

  function editTodo(id){
    setTodoId(id)
    todos.map((item)=>{
      if(item.id == id){
        setTitle(item.title)
      }
    })
  }

  function deleteTodo(id){
    let params = {'_method':'delete'};

    axios.post('/api/todos/'+id,params).then((response)=>{
        setTitle('')
        fetchTodos()
        setTodoId('')
    })
  }

  function isDoneTodo(id,is_done){

    let params = {'is_done': !is_done}

    axios.post('/api/todos/done/'+id,params).then((response)=>{
        setTitle('')
        fetchTodos()
        setTodoId('')
    })
  }

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-7">
              <h1 className='text-center'>Todo App</h1>
              <form className="mt-3" method="POST" onSubmit={submitForm}>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" placeholder="Type..."
                    name="title"
                    value={title} 
                    onChange={titleChange} />
                  <div className="input-group-append">
                    <button type="submit" className="input-group-text">Save</button>
                  </div>
                </div>
              </form>

              <table className="table table-border">
                <thead>
                  <tr>
                    <th></th>
                    <th>Sno.</th>
                    <th>Title</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todos && 
                    todos.map((item,i)=>(
                      <tr key={i} className={item.is_done ? 'text-decoration-line-through' : ''}>
                        <td>
                          <input 
                            type="checkbox"
                            className="form-check-input"
                            checked={item.is_done}
                            onChange={()=>isDoneTodo(item.id,item.is_done)} />
                        </td>
                        <td>{i+1}</td>
                        <td>{item.title}</td>
                        <td>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={()=> editTodo(item.id)}
                            >Edit</button>

                          &nbsp;<button className="btn btn-danger btn-sm"
                          onClick={()=> deleteTodo(item.id)}
                          >Delete</button>
                        </td>
                      </tr>


                  ))}
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}


export async function getServerSideProps(context){
  const res = await fetch(process.env.BACKEND_URL+'/api/todos')
  const todos = await res.json()
  return { props: { todos }}
}