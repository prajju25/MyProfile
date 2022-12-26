import React, { useEffect, useState } from "react";
import { Grid, Image, Rating } from "semantic-ui-react";
import axios from 'axios';
import { ProfileObject } from "../Interface/ProfileObject";

const MyProfile = () => {
    const [state, setState] = useState<ProfileObject>();
    useEffect(()=>{
        axios.get('./myProfile.json',{
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             }
          }).then((res)=>{
            setState(res.data);
          }).catch(err=>{
            console.log(err);
          });
    },[])
    return (
        <Grid celled>
            <Grid.Row>
                <Grid.Column width={5} className="bg-blue">
                    <div className="mb20">
                        <Image src={state?.displayPicture} />
                        <h1><strong>{state?.name}</strong></h1>
                        <span className="fs25">{state?.designation}</span>
                    </div>
                    <div className="mb20">
                        <h3><strong>Contact</strong></h3>
                        <div>
                            <label>Address</label>
                            <div>{state?.addressLine1}</div>
                            <div>{state?.addressLine2}</div>
                            <div>{state?.city}, {state?.state}, {state?.country} - {state?.pinCode}</div>
                        </div>
                        <div className="mt10">
                            <label>Phone</label>
                            <div>{state?.phoneNumber}</div>
                        </div>
                        <div className="mt10">
                            <label>E-mail</label>
                            <div>{state?.email}</div>
                        </div>
                        <div className="mt10">
                            <label>LinkedIn</label>
                            <div><a href={state?.linkedInURL}>{state?.linkedInURL}</a></div>
                        </div>
                        <div className="mt10">
                            <label>GitHub</label>
                            <div><a href={state?.gitHubURL}>{state?.gitHubURL}</a></div>
                        </div>
                    </div>
                    <div>
                        <h3>Skills</h3>
                        {state?.skills.map(skill=>{
                            return (
                                <div className="skill-rating" key={`skill_${skill.name}`}>
                                    <label>{skill.name}</label>
                                    <div><Rating maxRating={5} defaultRating={skill.rating} icon='star' size='massive' /></div>
                                </div>
                            );
                        })}
                    </div>
                </Grid.Column>
                <Grid.Column width={11} className="bg-white">
                    <div>{state?.description}</div>
                    <div>
                        <h3>Work History</h3>
                        {state?.workHistory.map((work,wi)=>{
                            return (
                                <Grid key={wi}>
                                    <Grid.Column width={3}>
                                        {work.startDate} / {work.endDate}
                                    </Grid.Column>
                                    <Grid.Column width={13}>
                                        <h4>{work.role}</h4>
                                        <div>{work.companyName}, {work.location}</div>
                                        <ul>
                                        {work.description.map((line,li)=>{
                                            return (
                                                <li key={li}>{line}</li>
                                            );
                                        })}
                                        </ul>
                                    </Grid.Column>
                                </Grid>
                            );
                        })}
                    </div>
                    <div>
                        <h3>Education</h3>
                        {state?.education.map((e,ei)=>{
                            return (
                                <Grid key={ei}>
                                    <Grid.Column width={3}>
                                        {e.startDate} / {e.endDate}
                                    </Grid.Column>
                                    <Grid.Column width={13}>
                                        <h4>{e.courseName}</h4>
                                        <div>{e.schoolName}</div>
                                        <div>{e.isPercentage ? "Percentage" : "CGPA"}: {e.marks}{e.isPercentage && "%"}</div>
                                    </Grid.Column>
                                </Grid>
                            )
                        })}
                    </div>
                    <div>
                        <h3>Accomplishments</h3>
                        <ul>
                        {state?.accomplishments.map((a,ai)=>{
                            return (
                                <li key={ai}>{a}</li>
                            );
                        })}
                        </ul>
                    </div>
                    <div>
                        <h3>Certifications</h3>
                        {state?.certifications.map((c,ci)=>{
                            return (
                                <Grid key={ci}>
                                    <Grid.Column width={3}>{c.completedDate}</Grid.Column>
                                    <Grid.Column width={13}>{c.certificateName}</Grid.Column>
                                </Grid>
                            );
                        })}
                    </div>
                    <div>
                        <h3>Interests</h3>
                        <ul>
                        {state?.interests.map((i,ii)=>{
                            return (
                                <li key={ii}>{i}</li>
                            );
                        })}
                        </ul>
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
}

export default MyProfile;