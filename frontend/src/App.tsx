import Navbar from './components/navbar'
import Footer from './components/footer'
import Login from './components/login'


function App() {
 

  return (
    <div className="container-app" style={{display: "flex", flexDirection: "column", minHeight: "100vh", flex: "1 0 auto"}}>
      <Navbar/>

      <main className="container-main" style={{display: "flex", flexGrow: 1}}>
        <Login/>
      </main>

      <Footer/>
    </div>
  )
}

export default App
