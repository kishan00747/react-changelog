import React, { Component } from "react";
import PropTypes from "prop-types";
import ChangelogList from "../components/ChangelogList.js";
import ChangelogFilter from "../components/ChangelogFilter.js";

export default class ChangelogContainer extends Component {
  static propTypes = {
    endpoint: PropTypes.string,
    data: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      list: [],
      versions: [],
      filter: {
        improvement: false,
        'bug-fix': false,
        feature: false
      }
    };
  }

  componentWillMount() {
    const { endpoint, data } = this.props;
    // TODO: Add error handling and bad format
    if (data) {
      const { title, list } = data;
      const versions = list.map(({ version }) => {
        return {
          version,
          slug: version.replaceAll(".", "")
        };
      });
      this.setState({
        list,
        title,
        versions
      });
    }
    else {
      fetch(endpoint)
        .then(response => response.json())
        .then(({ title, list }) => {
          const versions = list.map(({ version }) => {
            return {
              version,
              slug: version.replaceAll(".", "")
            };
          });
          this.setState({
            list,
            title,
            versions
          });
        });
    }
  }

  onChange(e) {
    // TODO: Use spread operator to make the function pure
    const filter = this.state.filter;
    filter[e.target.value] = !filter[e.target.value];
    this.setState({
      filter
    });
  }

  render() {
    return (
      <div className="ChangelogContainer">
        <div className="row">
          <div className="col-md-12">
            <div className="changelog-wrapper js-changelog">
              <h1 className="changelog-title">{this.state.title}</h1>
              <ChangelogFilter
                versions={this.state.versions}
                onChange={this.onChange.bind(this)}
              />
              <ChangelogList
                list={this.state.list}
                filter={this.state.filter}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
