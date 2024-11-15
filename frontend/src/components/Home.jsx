import { useEffect, useState } from "react";
import './home.css'
import Input from "./forms/FormElements/Input";
import { Button, Col, DateRangePicker, FlexboxGrid, Modal } from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Label from "./forms/FormElements/Label";
import styles from './home.module.css';



let fetchApiUrl = '';

export default function Home() {

    const userFeed = JSON.parse(localStorage.getItem('user'));
    let apiName = userFeed?.feed ? userFeed.feed.api_data_source : '';

    // const [apiName, setApiName] = useState(userFeed.feed ? userFeed.feed.api_data_source : '');
    const [apiData, setApiData] = useState();
    const [currentPage, setCurrentPage] = useState(apiName == "New York Times" ? 0 : 1);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(10);
    const [recordsPerPage] = useState(10);
    const [error, setError] = useState();
    const [search, setSearch] = useState(userFeed?.feed?.category != null ? userFeed.feed.category : 'news');
    const [searchButton, setSearchButton] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [author, setAuthor] = useState('');

    const [open, setOpen] = useState(apiName ? false : true);
    const navigate = useNavigate();



    if (apiName == "New York Times") {
        fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}`;
        if (startDate && endDate) {
            fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}&begin_date=${startDate}&end_date=${endDate}`;
        }
    } else
        if (apiName == "News API ORG") {
            fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}`;
            if (startDate && endDate) {
                fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}&from=${startDate}&to=${endDate}`;
            }
        } else
            if (apiName == "The Guardian") {
                fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}`;
                if (startDate && endDate) {
                    fetchApiUrl = `${userFeed.feed.api_data_source_url}&q=${search}&page=${currentPage}&from-date=${startDate}&to-date=${endDate}`;
                }
            }

    useEffect(() => {

        async function getArticles() {
            setLoading(true);
            setSearchButton(false);
            const response = await fetch(`${fetchApiUrl}`);
            const data = await response.json();
            if (data.status == "OK" || data.status == "ok" || data.response.status == "ok") {
                switch (apiName) {
                    case 'New York Times':
                        setApiData(data.response.docs);
                        setTotalPages(data.response.docs.length);
                        break;
                    case 'News API ORG':
                        setApiData(data.articles);
                        setTotalPages(data.articles.length);
                        break;
                    case 'The Guardian':
                        setApiData(data.response.results);
                        setTotalPages(data.response.results.length);
                        break;
                    default:
                        setApiData('');
                }
                setLoading(false);
                if (error) {
                    setError();
                }
            } else {
                switch (apiName) {
                    case 'New York Times':
                        setError(data.fault);
                        break;
                    case 'News API ORG':
                        setError(data.message);
                        break;
                    default:
                        setError();
                }
            }
        }
        getArticles();

    }, [currentPage, searchButton]);


    let pageNumbers = '';
    if (apiData) {
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const nPages = Math.ceil(totalPages / recordsPerPage);
        pageNumbers = apiName == 'News API ORG' ? [...Array(nPages + 1).keys()].slice(1) : [...Array(totalPages + 1).keys()].slice(1);
    }


    function handlePrevClick() {
        if ((apiName == 'New York Times' ? currentPage : currentPage - 1) == 0) {
            return;
        } else {
            setCurrentPage(currentPage => currentPage - 1)
        }
    }

    function handleNextClick() {
        if ((apiName == 'New York Times' ? currentPage : currentPage + 1) == totalPages) {
            return;
        } else {
            setCurrentPage(currentPage => currentPage + 1)
        }
    }

    function handleDateClick(date) {
        switch (apiName) {
            case 'New York Times':
                setStartDate(moment(date[0]).format('YYYYMMDD'));
                setEndDate(moment(date[1]).format('YYYYMMDD'));
                break;
            case 'News API ORG':
                setStartDate(moment(date[0]).format('YYYY-MM-DD'));
                setEndDate(moment(date[1]).format('YYYY-MM-DD'));
                break;
            case 'The Guardian':
                setStartDate(moment(date[0]).format('YYYY-MM-DD'));
                setEndDate(moment(date[1]).format('YYYY-MM-DD'));
                break;
            default:
                break;
        }
    }

    function handleDateClean() {
        setStartDate(null);
        setEndDate(null);
    }

    useEffect(() => {
        document.title = 'Home';
    }, []);


    return (
        <>
            <div className="container">
                <h1>Trending Articles</h1>

                {/* Modal popup */}
                <Modal backdrop="static" keyboard={false} open={open} onClose={() => setOpen(false)}>
                    <Modal.Header>
                        <Modal.Title>Info</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Please select a data source from profile section first.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => navigate('/user/profile')} appearance="primary">
                            Visit Profile
                        </Button>
                        <Button onClick={() => setOpen(false)} appearance="subtle">
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Filters */}
                <div className="show-grid search-filter">
                    <FlexboxGrid justify="space-around">
                        <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                            <Label htmlFor="search">Filter by Search:</Label>
                            <Input type="text" className={`form-control search-text`} placeholder="Search" name="search" onChange={() => setSearch(event.target.value)} />
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                            <Label htmlFor="search">Data Source:</Label>
                            <Input type="text" defaultValue={userFeed?.feed.api_data_source} disabled="disabled" className="form-control form-control-xs" />
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                            <Label htmlFor="search">Filter by Date Range:</Label>
                            <DateRangePicker placeholder="Select Date" onClean={handleDateClean} onOk={handleDateClick} className={`${styles.date_picker}`} />
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                            <Label htmlFor="search">Filter by Author:</Label>
                            <Input type="text" placeholder="Type Author" defaultValue={userFeed?.feed.author} />
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item as={Col} colspan={24} md={6}>
                            <button className={`search-button ${styles.search_button}`} onClick={() => setSearchButton(true)} disabled={loading ? 'disabled' : null}>Search</button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </div>

                {error && <h3 className="error">{error}</h3>}

                {loading && <span className="loader"></span>}

                {!loading &&
                    <div className="wrap">
                        {apiName == 'New York Times' &&
                            <>
                                {apiData && apiData.map((data) => (
                                    <div className="box" key={data._id}>
                                        <div className="box-top">
                                            <img className="box-image" src={`https://static01.nyt.com/${data.multimedia[0] ? data.multimedia[0].url : ''}`} alt="image" />
                                            <div className="title-flex">
                                                <h4 className="box-title">{data.headline.main}</h4>
                                                <p className="user-follow-info">{moment(data.pub_date).format('YYYY-MM-DD')}</p>
                                            </div>
                                            <p className="description">{data.lead_paragraph}</p>
                                        </div>
                                        <a href={data.web_url} className="button" target="_blank">Read More</a>
                                    </div>
                                ))}
                            </>
                        }
                        {apiName == 'News API ORG' &&
                            <>
                                {apiData && apiData.map((data, i) => (
                                    <div className="box" key={i}>
                                        <div className="box-top">
                                            <img className="box-image" src={`${data.urlToImage ? data.urlToImage : ''}`} alt="image" />
                                            <div className="title-flex">
                                                <h4 className="box-title">{data.title}</h4>
                                                <p className="user-follow-info">{moment(data.publishedAt).format('YYYY-MM-DD')}</p>
                                            </div>
                                            <p className="description">{data.description}</p>
                                        </div>
                                        <a href={data.url} className="button" target="_blank">Read More</a>
                                    </div>
                                ))}
                            </>
                        }
                        {apiName == 'The Guardian' &&
                            <>
                                {apiData && apiData.map((data, i) => (
                                    <div className="box" key={i}>
                                        <div className="box-top">
                                            {/* <img className="box-image" src={`${data.urlToImage ? data.urlToImage : ''}`} alt="image" /> */}
                                            <div className="title-flex">
                                                <h4 className="box-title">{data.webTitle}</h4>
                                                <p className="user-follow-info">{moment(data.webPublicationDate).format('YYYY-MM-DD')}</p>
                                            </div>
                                            {/* <p className="description">{data.description}</p> */}
                                        </div>
                                        <a href={data.webUrl} className="button" target="_blank">Read More</a>
                                    </div>
                                ))}
                            </>
                        }
                    </div>
                }

                {/* Pagination */}
                {!loading &&
                    <>
                        {apiData &&
                            <nav>
                                <ul className='pagination justify-content-center flex-wrap'>
                                    <li className="page-item">
                                        <a className="page-link"
                                            onClick={handlePrevClick}>
                                            Previous
                                        </a>
                                    </li>
                                    {pageNumbers.map(pgNumber => (
                                        <li key={pgNumber}
                                            className={`page-item ${(apiName == 'New York Times' ? (currentPage + 1) == pgNumber : currentPage == pgNumber) ? 'active' : ''} `} >
                                            <a onClick={() => setCurrentPage(pgNumber)}
                                                className='page-link'>
                                                {pgNumber}
                                            </a>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <a className="page-link"
                                            onClick={handleNextClick}>
                                            Next
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        }
                    </>
                }

            </div>
        </>
    );
}