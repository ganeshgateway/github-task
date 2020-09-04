import React from 'react';
import { MDBDataTable } from 'mdbreact';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './ShowResult.css';

class ShowResult extends React.Component {

    

    render() {
        const data = {
            columns: [
                {
                    label: 'Commits',
                    field: 'Commits',
                    sort: 'asc',
                    width: 150
                },
                {
                    label: 'Contributor',
                    field: 'contributor',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Pull Request',
                    field: 'Pull',
                    sort: 'asc',
                    width: 270
                
                },
                {
                    label: 'Issues',
                    field: 'issues',
                    sort: 'asc',
                    width: 270
                },
                {
                    label: 'Comments',
                    field: 'comments',
                    sort: 'asc',
                    width: 270
                }
            ],
            rows: this.props.resultData
        };
        return (
            <div className='result'>
                <MDBDataTable
                    striped
                    bordered
                    small
                    data={data}
                    searching={false}
                />
            </div>
        )
    }
}
export default ShowResult;