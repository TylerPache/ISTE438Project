import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RecordDetail = () => {
    const [ record, setRecord ] = useState(null);
    const [ name, setName ] = useState('');
    const [ comment, setComment ] = useState('');
    const [ image, setImage ] = useState('');
    
    let params = useParams();
    const navigate = useNavigate();

    const getRecordAndImage = async () => {
        try {
            let response = await fetch(`http://localhost:5000/record/${params.id}`);
            let data = await response.json();

            console.log("RECORD DATA: " + JSON.stringify(data));

            setRecord(data);

            const facility = data.Facility;
            response = await fetch(`http://localhost:5000/record/image/${facility}`);
            const blob = await response.blob();

            setImage(URL.createObjectURL(blob));
        } catch (error) {
            console.log('ERROR in getRecord: ' + error);
        }
    };

    useEffect(() => {
        getRecordAndImage()
    }, []);

    const onSubmitComment = async event => {
        try {
            event.preventDefault();
            await fetch(`http://localhost:5000/comment/${params.id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, comment })
            });

            console.log('onsubmitComment ' + name + ' ' + comment);

            setRecord({ ...record, comments: [ ...record.comments, { name, comment } ] });
            setName('');
            setComment('');
        } catch (error) {
            console.log('ERROR IN onSubmitComment: ' + onSubmitComment);
        }
    };

    const recordDetail = record? (
        <ul>
            <li>Year: { record.Year }</li>
            <li>County: { record.County }</li>
            <li>Facility: { record.Facility }</li>
            <li>Attendance: { record.Attendance }</li>
            <li>Latitude: { record.latitude }</li>
            <li>Longitude: { record.longitude }</li>
        </ul>
    ) : ( <div>Loading...</div> );
    
    const showComments = () => {
        if (record) {
            if (record.comments.length) {
                const commentList = record.comments.map(comment => (
                    <li className='list-group-item'>Name: { comment.name }, Comment: { comment.comment }</li>
                ));

                return (
                    <div>
                        <ul className='list-group'>
                            { commentList }
                        </ul>
                    </div>
                );
            } else {
                return <div>No comments to show</div>
            };
        } else {
            return <div>Loading comments...</div>;
        }
    };
    
    const showImage = () => {
        if (image) {
            return <img src={image} alt="No Image available for this record" className='rounded' />;
        }

        return "No Image available for this record";
    };

    return (
        <div className="container">
            <button className='btn btn-light' onClick={() => navigate(-1)}>Go Back</button>

            <h1 className='mt-3'>Record</h1>

            <div>
                { recordDetail }
            </div>

            <h4 className='mt-4'>Comments</h4>

            <div className='mb-3'>
                <form onSubmit={onSubmitComment}>
                    <label>
                        Your name:
                        <input 
                            value={name} 
                            onChange={event => setName(event.target.value)} 
                            className="mx-3"
                        />
                    </label>

                    <label>
                        Your comment: 
                        <input 
                            value={comment} 
                            onChange={event => setComment(event.target.value)} 
                            className="mx-3"
                        />
                    </label>

                    <button type="submit" className='btn btn-primary'>Submit Comment</button>
                </form>
            </div>

            { showComments() }

            <h4 className='mt-4'>Image</h4>
            <div className='mt-3'>
                { showImage() }
            </div>
        </div>
    );
};

export default RecordDetail;