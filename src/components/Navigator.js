import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';

import Icon from '../components/Icon';

/**
 * 回退的时候会出现之前的url失效的情况，浏览器的history接口无法访问到history.previsous，不能在回退之前对url进行验证，所以需要手动记录浏览历史
 */

class Navigator extends Component {
  static propTypes = {
    changePath: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    search: PropTypes.func,
  };

  static defaultProps = {
    placeholder: 'Search',
  };

  constructor(props) {
    super(props);
    this.ignoreHashChangeOnce = false;
    this.state = {
      current: 0,
      input: '',
      stack: [ window.location.hash ],
    };
  }

  render() {
    return (
      <div className="search-bar-container">
        <div
          className={classNames('btn', { 'btn-disabled': this.state.current <= 0 })}
          onClick={this.handleNavigateBack}
        >
          <Icon
            className="back-icon"
            iconName="chevron-left"
          />
        </div>
				<div
					className={classNames('btn', { 'btn-disabled': this.state.current >= this.state.stack.length - 1 })}
					onClick={this.handleNavigateForward}
				>
					<Icon
						className="forward-icon"
						iconName="chevron-right"
					/>
				</div>
				<div className="search-bar">
					<input
						type="search"
						placeholder={this.props.placeholder}
						value={this.state.input}
						onChange={this.handleInputChange}
					/>
					<Icon
						className="search-icon"
						iconName="search"
					/>
				</div>
			</div>
    );
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.handleHashChange);
  }

  handleHashChange = (e) => {
    if (this.ignoreHashChangeOnce) {
      this.ignoreHashChangeOnce = false;
    }
    else {
      this.setState({
        current: this.state.current + 1,
        stack: [...this.state.stack.slice(0, this.state.current + 1), window.location.hash],
      });
    }
  }

	handleNavigateBack = () => {
    if (this.state.current > 0) {
      this.ignoreHashChangeOnce = true;
      window.location.hash = this.state.stack[this.state.current - 1];
      this.setState({
        current: this.state.current - 1,
      });
    }
	};

	handleNavigateForward = () => {
    if (this.state.current < this.state.stack.length - 1) {
      this.ignoreHashChangeOnce = true;
      window.location.hash = this.state.stack[this.state.current + 1];
      this.setState({
        current: this.state.current + 1,
      });
    }
	};

  handleInputChange = (e) => {
    this.setState({
      input: e.target.value,
    });
  }
}

export default Navigator;
