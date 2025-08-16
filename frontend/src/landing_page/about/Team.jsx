import React from 'react'
import { Link } from 'react-router-dom'

const Team = () => {
  return (
    <div className="container">
      <div className="row p-3 mt-5 border-top">
        <h1 className="text-center ">Developed By</h1>
      </div>

      <div
        className="row p-3 text-muted"
        style={{ lineHeight: "1.8", fontSize: "1.2em" }}
      >
        <div className="col-6 p-3 text-center">
          <img
            src="images/arfatfakih.jpeg"
            style={{ borderRadius: "100%", width: "50%" }}
          />
          <h4 className="mt-5">Arfat Fakih</h4>
        </div>
        <div className="col-6 p-3">
          <p>
            This platform was created by Arfat Fakih, a passionate full-stack developer and AI enthusiast, with the vision of making trading and investing simple, transparent, and accessible to everyone.
          </p>
          <p>
            During his journey as a developer, Arfat realized that most platforms are either too complex for beginners or too restrictive for active users. To overcome these challenges, he designed this website to offer a clean, intuitive, and reliable trading experience. With features like interactive dashboards, secure APIs, and a responsive interface, the platform helps users focus less on navigating tools and more on making informed financial decisions.
          </p>
          <p>For Arfat, building this project is not just about technology — it's about streamlining processes, solving real problems, and creating impact through innovation.</p>
          <p>
            Connect on <Link to="/" style={{textDecoration: "none"}}>Homepage</Link> / <a href="" style={{textDecoration: "none"}}>TradingQnA</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Team