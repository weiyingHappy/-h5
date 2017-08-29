import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
// import { Calendar,DateRange } from 'react-date-range';
import moment from "moment";
import InfiniteCalendar, { Calendar, withRange } from "react-infinite-calendar";
import "react-infinite-calendar/styles.css";
import "./datePicker.scss";
import { setDate, getTime } from "@/src/actions/storage";
import { fetchRoomLockedDate } from "@/src/actions/room";

const rangeComponent = withRange(Calendar)

class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);
    this.odd = true;
    this.state = {
      yd: false, // 夜审时间是否已过
      range: {
        start: moment(),
        end: moment().add(1, "days")
      },
      lockedDate: []
    };
  }

  componentWillMount() {
    let { dispatch, storage, query } = this.props,
      self = this;

    this.setState({
      range: {
        start: moment(storage.from),
        end: moment(storage.to)
      }
    });

    dispatch(getTime()).then(res => {
      let { st, h, m } = res;
      let end = moment().hour(parseInt(h)).minutes(parseInt(m)).seconds(0);
      let server_time = moment(st * 1000);

      if (server_time.isBefore(end)) {
        self.setState({
          yd: true
        });
      } else {
        self.setState({
          yd: false
        });
      }
    });

    // 如果query带了房间id，那么将判断该房间的锁定状态
    if (query.room_id) {
      const minDate = this.state.yd
        ? moment().subtract(1, "d")
        : moment();

      const maxDate = moment().add(2, "months");

      dispatch(
        fetchRoomLockedDate(minDate.format('YYYY-MM-DD'), maxDate.format('YYYY-MM-DD'), query.room_id)
      ).then(data => {
        if (data.code === 200) {
          this.setState({
            lockedDate: data.results.map(date_str => moment(date_str.time))
          });
        }
      });
    }
  }

  handleSelect(range) {
    if (!this.odd) return;
    this.odd = false;

    this.odd = false;
    let { storage, dispatch } = this.props;

    let start = range.startDate,
      end = range.endDate;

    if (storage.datePicker == 1) {
      dispatch(
        setDate({
          from: moment(start).format("YYYY-MM-DD"),
          to: moment
            .max(moment(start).add(1, "d"), moment(storage.to))
            .format("YYYY-MM-DD")
        })
      );
    } else {
      dispatch(
        setDate({
          from: moment(storage.from).format("YYYY-MM-DD"),
          to: moment(range.endDate).format("YYYY-MM-DD")
        })
      );
    }
    browserHistory.goBack();
  }

  dateChange(event) {
    this.setState({
      range: {
          start: new moment(event.start),
          end: new moment(event.end)
      }
    })
  }

  dateSelect() {
    let flag = false;
    this.state.lockedDate.map(lockdate_item => {
      console.log(lockdate_item.format("YYYY-MM-DD"));
      if (
        lockdate_item.isBetween(this.state.range.start, this.state.range.end) ||
        lockdate_item.isSame(this.state.range.start, "day")
      ) {
        flag = true;
      }
    });
    if (flag) {
      alert("该房型含被锁定时段，请重新选择入离时间");
      return;
    }

    if (this.state.range.start.isSame(this.state.range.end)) {
      alert("你还未选择离开时间");
      return;
    }
    let { dispatch } = this.props;
    const { start, end } = this.state.range;
    dispatch(
      setDate({
        from: start.format("YYYY-MM-DD"),
        to: end.format("YYYY-MM-DD")
      })
    );

    browserHistory.goBack();
  }

  render() {
    let { storage } = this.props;
    let from = moment(storage.from);
    let to = moment(storage.to);

    return (
      <div className="date-picker-container">
        {/*<div className="date-container-date">
                    <div className="dcc">
                        <div className="dcc-a">
                            请选择{storage.datePicker==1?'入住':'离店'}日期
                        </div>
                        <DateRange
                            onChange={this.handleSelect}
                            startDate={storage.datePicker==1?storage.from:moment.max(moment(from).add(1,'d'),to)}
                            endDate={storage.datePicker==1?storage.from:moment.max(moment(from).add(1,'d'),to)}
                            minDate={storage.datePicker==1?(this.state.yd?moment().subtract(1,'d'):moment()):moment(from).add(1,'d')}
                            maxDate={storage.datePicker==1?moment().add(3,'months').subtract(1,'d'):moment().add(3,'months')}
                            format="YYYY/MM/DD"
                            lang='cn'
                        />
                    </div>
                </div>*/}
        <div className="date-select">
          <InfiniteCalendar
            Component={rangeComponent}
            width={"100%"}
            height={(document.body.clientHeight - 147) * 0.8}
            minDate={
              this.state.yd
                ? moment().subtract(1, "d").toDate()
                : moment().toDate()
            }
            maxDate={moment().add(2, "months").toDate()}
            min={moment().startOf("month").toDate()}
            max={moment().add(2, "months").endOf("month").toDate()}
            locale={{
              headerFormat: "MM月DD日",
              locale: require("date-fns/locale/zh_cn"),
              weekdays: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
              todayLabel: {
                long: "回到今天",
                short: "今天"
              }
            }}
            onSelect={event => {
              this.dateChange(event); 
              return false;
            }}
            disabledDates={this.state.lockedDate
              .map(date => date.toDate())
              .filter(date => {
                // 离店时间禁用判断
                if(moment(this.state.range.start).add(1, 'day').isSame(date)) {
                  return false
                }
                return true;
              })}
            selected={{
              start: this.state.range.start.toDate(),
              end: this.state.range.end.toDate()
            }}
          />
          <div
            className="operationbtns"
            style={{ height: (document.body.clientHeight - 147) * 0.2 }}
          >
            <button
              onClick={() => {
                this.dateSelect();
              }}
            >
              确定
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    storage: state.storage,
    query: state.routing.locationBeforeTransitions.query
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(DatePicker);
