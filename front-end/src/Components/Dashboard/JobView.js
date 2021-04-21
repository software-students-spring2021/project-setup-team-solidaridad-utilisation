import React, {useEffect, useState} from 'react'
import { useHistory, Link, useParams } from "react-router-dom"
import {Card, Dropdown, Menu} from "antd"
import './styles.css'
import {DownOutlined} from '@ant-design/icons'
import axios from 'axios'

const JobView = (props) => {
    const history = useHistory()
    const [status, setStatus] = useState("Open")
    const [loading, setLoading] = useState(true)
    const [job, setJob] = useState()
    const { jobID } = useParams()

    // Using document.URL to parse the current URL to get the current job's ID
    //const jobID = document.URL.split("/")[5]

    // useEffect(async () => {
    //     const job = await axios("http://localhost:4000/business/jobDetails/" + jobID)
    //     setStatus(job.data.status)
    // }, [])
    useEffect(async () => {
        const result = await axios("http://localhost:4000/jobs/" + jobID)
        console.log(result.data)
        setStatus(result.data.status) 
        setJob(result.data)
        setLoading(false)
    }, []);

    function handleMenuClick(i) {
        if(i.key == '1'){
            axios.put(("http://localhost:4000/jobs/" + jobID), {
                changeStatus: "Open"
            }).then((res) => {
                setStatus('Open')
            }).catch(err => {
                console.log(err)
            })
        } 
        else if(i.key == '2'){
            axios.put(("http://localhost:4000/jobs/" + jobID), {
                changeStatus: "Closed"
            }).then((res) => {
                setStatus('Closed')
            }).catch(err => {
                console.log(err)
            })        
        }
        else{
            axios.put(("http://localhost:4000/jobs/" + jobID), {
                changeStatus: "Archived"
            }).then((res) => {
                setStatus('Archived')
            }).catch(err => {
                console.log(err)
            })        
        }
    }

    const menu = () =>{
        return(
            <Menu 
                onClick={handleMenuClick}
            >
                <Menu.Item key='1'>Open</Menu.Item>
                <Menu.Item key='2'>Close</Menu.Item>
                <Menu.Item key='3'>Archive</Menu.Item>
            </Menu>
        );
    }

    return ( 
        <div>
            {!loading ? (
                <Card
                title = {'Applicants to ' + job.jobTitle}
                extra = {
                    <div className="headerextra">
                        <div className="headCounter">
                            Applications: {job.applicantCount}
                        </div>
                        <Dropdown
                            overlay={menu()}
                        >
                            <a>
                                {status} <DownOutlined/>
                            </a>
                        </Dropdown>                    
                    </div>
                }
                >               
                {job.applicants && job.applicants.map((applicant) => (
                    <Card
                        title={applicant.firstName + ' ' + applicant.lastName}
                        extra={
                            <Link
                                to={{
                                    pathname:`/business/dashboard/applications/${applicant._id}`,
                                    aboutProps:applicant
                                }}
                            >
                                View Application
                            </Link>
                        }
                    >
                        <div className="description">
                            <div className="education">
                                {applicant.education}
                                {console.log({applicant})}
                            </div>
                            <div className="recentWork">
                                {applicant.workExperience}
                            </div>
                        </div>
                    </Card>
                 ))}
            </Card>
            ) : ""}
        </div>
        
    )
}

export default JobView