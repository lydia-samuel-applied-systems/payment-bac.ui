import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            sessionId: "",
            policy: [],
            accountName: "",
            accountNumber: "",
            sortCode: "",
            amount: 0.0
        };
    }

    componentDidMount() {
        this.loadSessionData();
    }

    submitButton() {
        return <button type="submit" className="btn btn-primary">Submit</button> 
            // TODO: Get ui validation working
        /*if (this.state.accountName) {
            return <button type="submit" className="btn btn-primary">Submit</button>
        } else {
            return <button type="submit" className="btn btn-primary" disabled>Submit</button>
        };
        */
    }

    render() {
        return (
            <div>
                <h1>Policy Information</h1>
                {Home.renderPolicyInfo(this.state.policy)}
                <form onSubmit={ async (e) => {
                    e.preventDefault();

                    const paymentResponse = await fetch("https://localhost:7056/api/session/submitpaymentdetails",
                        {
                            method: 'POST',
                            mode: 'cors',
                            body: `{
                                    'SessionId':'${this.state.sessionId}',
                                    'PolicyId':'${this.state.policy.policyId}',
                                    'AccountName':'${this.state.accountName}',
                                    'AccountNumber':'${this.state.accountNumber}',
                                    'SortCode':'${this.state.sortCode}',
                                    'Amount':'${this.state.amount}'
                                    }`,
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type': 'application/json'
                            }
                        });

                    const paymentData = await paymentResponse.json();

                    // TODO: display status message
                }}>
                    <div className='form-group'>
                        <label htmlFor='AccountName'>Account Name:</label>
                        <input className="form-control" type="text" id="AccountName" name="AccountName" onChange={ e => this.state.accountName = e.target.value}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='AccountNumber'>Account Number:</label>
                        <input className="form-control" type="text" id="AccountNumber" name="AccountNumber" onChange={e => this.state.accountNumber = e.target.value}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='SortCode'>Sort Code:</label>
                        <input className="form-control" type="text" id="SortCode" name="SortCode" onChange={e => this.state.sortCode = e.target.value}></input>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='Amount'>Amount:</label>
                        <input className="form-control" type="number" id="Amount" name="Amount" onChange={e => this.state.amount = e.target.value} placeholder="0"></input>
                    </div>
                    <br/>
                    {this.submitButton()}
                </form>
            </div>
        );
    }



    static renderPolicyInfo(policy)
    {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Policy ID</th>
                        <th>Policy Name</th>
                        <th>Policy Description</th>
                        <th>Paid</th>
                        <th>Total</th>
                        <th>Due</th>
                    </tr>
                </thead>
                <tbody> 
                    <tr key={policy.policyId}>
                        <td>{policy.policyId}</td>
                        <td>{policy.policyName}</td>
                        <td>{policy.policyDescription}</td>
                        <td>{policy.policyPaid}</td>
                        <td>{policy.policyTotal}</td>
                        <td>{policy.policyDue}</td>
                    </tr>       
                </tbody>
            </table >
        );
    }

    async loadSessionData()
    {
        const sessionResponse = await fetch("https://localhost:7056/api/session/startsession",
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            });

        const sessionData = await sessionResponse.json();
        const sessionId = sessionData.sessionId;

        this.setState({ sessionId: sessionId });

        const policyResponse = await fetch("https://localhost:7056/api/session/lookupsessiondata",
            {
                method: 'POST',
                mode: 'cors',
                body: `{'SessionId':'${sessionId}'}`,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            });

        const policyData = await policyResponse.json();

        this.setState({ policy: policyData });
    }
}
