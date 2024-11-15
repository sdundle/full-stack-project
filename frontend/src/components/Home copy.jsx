import { useEffect, useState } from "react";
import './home.css'
import Input from "./forms/FormElements/Input";

let fetchApiUrl = '';

export default function Home() {

    console.log(process.env.NODE_ENV);
    const userFeed = JSON.parse(localStorage.getItem('user'));
    let apiName = userFeed.feed ? userFeed.feed.api_data_source : '';

    // const [apiName, setApiName] = useState(userFeed.feed ? userFeed.feed.api_data_source : '');
    const [apiData, setApiData] = useState();
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(10);
    const [error, setError] = useState();
    const [search, setSearch] = useState(userFeed.feed ? userFeed.feed.category : '');
    const [searchButton, setSearchButton] = useState(false);


    if (apiName == "New York Times") {
        fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}`;
    } else
        if (apiName == "News API ORG") {
            fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=1`;
        }

    useEffect(() => {

        async function getArticles() {
            setLoading(true);
            setSearchButton(false);
            const response = await fetch(`${fetchApiUrl}`);
            // const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${search}&api-key=Qs3jd9p4UEVzELA8VxPD58VbICmfmjRp&page=${currentPage}`);
            const data = await response.json();
            if (data.status == "OK" || data.status == "ok") {
                switch (apiName) {
                    case 'New York Times':
                        setApiData(data.response.docs);
                        break;
                    case 'News API ORG':
                        setApiData(data.articles);
                        break;
                    default:
                        setApiData('');
                }
                // setApiData(data.response.docs);
                setLoading(false);
                if (error) {
                    setError();
                }
            } else {
                console.log(data.fault);
                setError(data.fault);
            }
        }
        getArticles();

    }, [currentPage, searchButton]);


    function handlePrevClick() {
        if (currentPage == 0) {
            return;
        } else {
            setCurrentPage(currentPage => currentPage - 1)
        }
    }

    function handleNextClick() {
        if (currentPage == totalPages) {
            return;
        } else {
            setCurrentPage(currentPage => currentPage + 1)
        }
    }


    return (
        <>
            <div className="container">
                <h1>Trending Articles</h1>

                <div className="search-filter">
                    <Input type="text" className="search-text" placeholder="Search" name="search" onChange={() => setSearch(event.target.value)} />
                    <button className="search-button" onClick={() => setSearchButton(true)} disabled={loading ? 'disabled' : null}>Search</button>
                </div>

                <div className="col-sm-4">
                    <input type="text" defaultValue={userFeed.feed.api_data_source} disabled="disabled" className="form-control form-control-xs" />
                </div>

                {error && <h3 className="error">{error.faultstring}</h3>}
                {/* {!apiData && <h3>Loading ..</h3>} */}
                {/* {apiData && apiData.map((data) => (
                    <div className="card" key={data._id}>
                        <img src="https://images.unsplash.com/photo-1615147342761-9238e15d8b96?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1001&q=80" className="card__image" alt="brown couch" />
                        <div className="card__content">
                            <time dateTime="2021-03-30" className="card__date">{data.pub_date}</time>
                            <span className="card__title">{data.headline.main}</span>
                        </div>
                    </div>
                ))} */}
                {loading && <span className="loader"></span>}

                {!loading &&
                    <div className="wrap">
                        {/* { (() => {
                            if(apiName == 'New York Times'){
                                console.log('inside');
                            }
                        })() } */}
                        {apiName == 'New York Times' &&
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
                        }
                        {apiName == 'News API ORG' &&
                            <>{apiData && apiData.map((data, i) => (                    
                                <div className="box" key={i}>
                                    <div className="box-top">
                                        <img className="box-image" src={`${data.urlToImage ? data.urlToImage : ''}`} alt="image" />
                                        <div className="title-flex">
                                            <h4 className="box-title">{data.title}</h4>
                                            <p className="user-follow-info">{data.publishedAt}</p>
                                        </div>
                                        <p className="description">{data.description}</p>
                                    </div>
                                    <a href={data.url} className="button" target="_blank">Read More</a>
                                </div>
                            ))}</>
                        }
                    </div>
                }

                {!loading &&
                    <>{apiData &&
                        (<><button onClick={handlePrevClick} disabled={currentPage == 0 ? 'disabled' : ''} className={currentPage == 0 ? 'disabled' : ''}>Prev Page</button>
                            <button onClick={handleNextClick} disabled={currentPage == 10 ? 'disabled' : ''} className={currentPage == 0 ? 'disabled' : ''}>Next Page</button></>)}
                    </>
                }

                {/* <div className="pagination">
                    <a href="#">&laquo;</a>
                    <a onClick={() => setCurrentPage(currentPage)}>1</a>
                    <a href="#">2</a>
                    <a href="#">3</a>
                    <a href="#">4</a>
                    <a href="#">5</a>
                    <a href="#">6</a>
                    <a href="#">&raquo;</a>
                </div> */}
            </div>
        </>
    );
}