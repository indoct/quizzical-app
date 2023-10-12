import React from "react"
import { nanoid } from 'nanoid'

export default function AnswerList(props) {
    console.log(props)

    return (
        <span>{props.option} </span>
    //     <label key={nanoid()}>
    //     <input 
    //         type="radio"
    //         // name={props.qid}
    //         // id={aId}
    //         // value={a}
    //         // onChange={props.handleChange}
    //     /> {props.option}
    // </label>
        )
    }