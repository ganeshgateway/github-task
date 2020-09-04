import React from "react";

class SearchInput extends React.Component {
    state = {
        repoName: "",
    };

    nameChangeHandler = (event) => {
        const value = event.target.value;
        this.setState({
            ...this.state,
            repoName: value
        }, () => this.props.nameChange(this.state.repoName));

    }
    render() {
        return (
            <div>
                <label htmlFor="sDate">Repo Name:</label>
                <input
                    type="text"
                    onChange={e => this.nameChangeHandler(e)}
                />
            </div>
        );
    }
}

export default SearchInput;