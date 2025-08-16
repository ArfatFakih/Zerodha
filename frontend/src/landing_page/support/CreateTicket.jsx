import React from 'react'

const CreateTicket = () => {
  return (
    <div className="container">
  <div className="row p-5 mt-5 mb-5">
    <h1 className="fs-2">To create a ticket, select a relevant topic</h1>

    {/* 1. Account Opening */}
    <div className="col-4 p-5 mt-2 mb-2">
      <h4>
        <i className="fa fa-plus-circle" aria-hidden="true"></i> Account Opening
      </h4>
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Online Account Opening
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Offline Account Opening
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Company, Partnership and HUF Account
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        NRI Account Opening
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Charges at Zerodha
      </a>
      <br />
    </div>

    {/* 2. Login Issues */}
    <div className="col-4 p-5 mt-2 mb-2">
      <h4>
        <i className="fa fa-user-circle" aria-hidden="true"></i> Login Issues
      </h4>
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Forgot Password / Reset Password
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Two-Factor Authentication (2FA) Problems
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Mobile App Login Errors
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Web Login Not Working
      </a>
      <br />
    </div>

    {/* 3. Trading */}
    <div className="col-4 p-5 mt-2 mb-2">
      <h4>
        <i className="fa fa-line-chart" aria-hidden="true"></i> Trading
      </h4>
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Placing Buy/Sell Orders
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Intraday vs Delivery Trades
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Options & Futures Trading
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Kite Platform Help
      </a>
      <br />
    </div>

    {/* 4. Funds */}
    <div className="col-4 p-5 mt-2 mb-2">
      <h4>
        <i className="fa fa-credit-card" aria-hidden="true"></i> Funds
      </h4>
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Adding Funds to Account
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Withdrawal Process
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Fund Transfer Issues
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        UPI / Net Banking Problems
      </a>
      <br />
    </div>

    {/* 5. Reports */}
    <div className="col-4 p-5 mt-2 mb-2">
      <h4>
        <i className="fa fa-file-text" aria-hidden="true"></i> Reports
      </h4>
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Trade History
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        P&L Statements
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Tax Reports
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Downloading Account Statements
      </a>
      <br />
    </div>

    {/* 6. Other Queries */}
    <div className="col-4 p-5 mt-2 mb-2">
      <h4>
        <i className="fa fa-question-circle" aria-hidden="true"></i> Other Queries
      </h4>
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Brokerage & Charges
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        Margin & Leverage
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        DP Charges
      </a>
      <br />
      <a href="" style={{ textDecoration: "none", lineHeight: "2.5" }}>
        General Enquiries
      </a>
      <br />
    </div>
  </div>
</div>

  )
}

export default CreateTicket