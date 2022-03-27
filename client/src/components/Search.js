import React from 'react';

const Search = (props) => {
    return (
        <div>
            <form onSubmit={props.onSearchSubmit}>
                <label>
                    Search :
                    <input className='ml-2' type="text" value={props.search} onChange={props.onChangeSearch} />
                </label>
                    
                <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="Region"
                        checked={props.selectedOption === "Region"}
                        onChange={props.onSelectedOptionChange}
                        className='mr-1'
                        />
                        Region
                    </label>
                </div>

                <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="County"
                        checked={props.selectedOption === "County"}
                        onChange={props.onSelectedOptionChange}
                        className='mr-1'
                        />
                        County
                    </label>
                </div>

                <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="Facility"
                        checked={props.selectedOption === "Facility"}
                        onChange={props.onSelectedOptionChange}
                        className='mr-1'
                        />
                        Facility
                    </label>
                </div>

                <div className="radio">
                    <label>
                        <input
                        type="radio"
                        value="lld"
                        checked={props.selectedOption === "lld"}
                        onChange={props.onSelectedOptionChange}
                        className='mr-1'
                        />
                        Longitude & Latitude & Distance
                    </label>
                </div>

                <button type="submit" class="btn btn-primary">Submit Search</button>
                <button class="btn btn-warning ml-2" onClick={props.onReset}>Reset</button>
            </form>
        </div>
    );
};

export default Search;