import React, { Component } from "react";
import ComputedValues from "./computedValues";
import "./getMoney.css";

class getMoney extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredValue: "",
      allNote: {},
      showTable: false,
      totalNotes: 0,
    };
  }

  moneyCalculation = () => {
    const { enteredValue, allNote } = this.state;
    let remainingMoney = enteredValue;
    let totalNotesTemp = 0;
    const currancy = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
    if (remainingMoney) {
      currancy.map((note) => {
        const NoOfNotes = parseInt(Number(remainingMoney) / Number(note));
        allNote[note] = NoOfNotes;
        totalNotesTemp += NoOfNotes;
        remainingMoney = remainingMoney - note * NoOfNotes;
      });
    }
    this.setState({ showTable: true, totalNotes: totalNotesTemp });
  };

  handleChange = (event) => {
    this.setState({ enteredValue: event.target.value });
  };

  testData = () => {
    let array = [1];
    let oldno = 1;
    for (let i = 1; i < 20; i++) {
      if (i == 1) {
        array.push(1);
        oldno = i;
      } else {
        array.push(i + oldno);
        oldno = i;
      }
    }
  };
  render() {
    return (
      <div className="mainatm">
        <div className="welcomeatm">
          <header>Welcome to ATM</header>
          {this.testData()}
          <p className="enter">Enter the Amount</p>
          <input
            type="number"
            onChange={this.handleChange}
            value={this.state.enteredMoney}
            className=""
          />
          <button onClick={this.moneyCalculation} className="">
            Get Money
          </button>
        </div>
        {this.state.showTable ? (
          <ComputedValues
            notes={this.state.totalNotes}
            data={this.state.allNote}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default getMoney;
