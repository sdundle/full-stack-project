export default function NewYorkApi({apiData}) {
    return (
        <>{apiData && apiData.map((data) => (
            <div className="box" key={data._id}>
                <div className="box-top">
                    <img className="box-image" src={`https://static01.nyt.com/${data.multimedia[0] ? data.multimedia[0].url : ''}`} alt="image" />
                    <div className="title-flex">
                        <h4 className="box-title">{data.headline.main}</h4>
                        <p className="user-follow-info">{data.pub_date}</p>
                    </div>
                    <p className="description">{data.lead_paragraph}</p>
                </div>
                <a href={data.web_url} className="button" target="_blank">Read More</a>
            </div>
        ))}</>
    );
}