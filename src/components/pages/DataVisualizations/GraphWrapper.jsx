import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import CitizenshipMapAll from './Graphs/CitizenshipMapAll';
import CitizenshipMapSingleOffice from './Graphs/CitizenshipMapSingleOffice';
import TimeSeriesAll from './Graphs/TimeSeriesAll';
import OfficeHeatMap from './Graphs/OfficeHeatMap';
import TimeSeriesSingleOffice from './Graphs/TimeSeriesSingleOffice';
import YearLimitsSelect from './YearLimitsSelect';
import ViewSelect from './ViewSelect';
import axios from 'axios';
import { resetVisualizationQuery } from '../../../state/actionCreators';
import test_data from '../../../data/test_data.json';
import { colors } from '../../../styles/data_vis_colors';
import ScrollToTopOnMount from '../../../utils/scrollToTopOnMount';

const REACT_APP_API_URI = `https://hrf-asylum-be-b.herokuapp.com/cases`;

const { background_color } = colors;

function GraphWrapper(props) {
  const { set_view, dispatch } = props;
  let { office, view } = useParams();
  if (!view) {
    set_view('time-series');
    view = 'time-series';
  }
  let map_to_render;
  if (!office) {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesAll />;
        break;
      case 'office-heat-map':
        map_to_render = <OfficeHeatMap />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapAll />;
        break;
      default:
        break;
    }
  } else {
    switch (view) {
      case 'time-series':
        map_to_render = <TimeSeriesSingleOffice office={office} />;
        break;
      case 'citizenship':
        map_to_render = <CitizenshipMapSingleOffice office={office} />;
        break;
      default:
        break;
    }
  }
  async function updateStateWithNewData(
    years,
    view,
    office,
    stateSettingCallback
  ) {
    /*
                  _                                                                             _
                  |                                                                                 |
                  |   Example request for once the `/summary` endpoint is up and running:           |
                  |                                                                                 |
                  |     `${url}/summary?to=2022&from=2015&office=ZLA`                               |
                  |                                                                                 |
                  |     so in axios we will say:                                                    |
                  |                                                                                 |     
                  |       axios.get(`${url}/summary`, {                                             |
                    |         params: {                                                               |
                      |           from: <year_start>,                                                   |
        |           to: <year_end>,                                                       |
        |           office: <office>,       [ <-- this one is optional! when    ]         |
        |         },                        [ querying by `all offices` there's ]         |
        |       })                          [ no `office` param in the query    ]         |
        |                                                                                 |
          _                                                                             _
          -- Mack 
          
          */

    console.log('API URL:', REACT_APP_API_URI);

    if (office === 'all' || !office) {
      const fiscal = await axios.get(`${REACT_APP_API_URI}/fiscalSummary`, {
        /**
         * I used an asynchronous axios call instead of a synchronous one. Since it is
         * asynchronous, the UI does not freeze, and other parts of our application can
         * still run while waiting on the call.
         */

        // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
        params: {
          from: years[0],
          to: years[1],
        },
      });
      const citizenship = await axios.get(
        `${REACT_APP_API_URI}/citizenshipSummary`,
        {
          // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
          params: {
            from: years[0],
            to: years[1],
            ...(office && { office }),
          },
        }
      );

      fiscal['citizenshipResults'] = citizenship.data;
      /**
       * Here we are assigning citizenship data to the 'citizenshipResults property
       * on the fiscal object
       */

      stateSettingCallback(view, office, [fiscal.data]);

      /**
       * Instead of using "then", I manually call the stateSettingCallback function
       * with view, office, and the new fiscal data
       */
    } else {
      const fiscal = await axios.get(`${REACT_APP_API_URI}/fiscalSummary`, {
        // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
        params: {
          from: years[0],
          to: years[1],
          office: office,
        },
      });

      const citizenship = await axios.get(
        `${REACT_APP_API_URI}/citizenshipSummary`,
        {
          // mock URL, can be simply replaced by `${Real_Production_URL}/summary` in prod!
          params: {
            from: years[0],
            to: years[1],
            office: office,
          },
        }
      );

      fiscal['citizenshipResults'] = citizenship.data;
      stateSettingCallback(view, office, [fiscal.data]);
      /**
       * These are identical to to assignment and callback from above for consistency
       */
    }
  }
  const clearQuery = (view, office) => {
    dispatch(resetVisualizationQuery(view, office));
  };
  return (
    <div
      className="map-wrapper-container"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '50px',
        backgroundColor: background_color,
      }}
    >
      <ScrollToTopOnMount />
      {map_to_render}
      <div
        className="user-input-sidebar-container"
        style={{
          width: '300px',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <ViewSelect set_view={set_view} />
        <YearLimitsSelect
          view={view}
          office={office}
          clearQuery={clearQuery}
          updateStateWithNewData={updateStateWithNewData}
        />
      </div>
    </div>
  );
}

//   .then(result => {
//   stateSettingCallback(view, office, result.data); // <-- `test_data` here can be simply replaced by `result.data` in prod!
//   console.log("result data: ", result.data);

// })
// .catch(err => {
//   console.error(err);
//   console.log("test data: ", test_data);
// });

// .then(result => {
//   stateSettingCallback(view, office, test_data); // <-- `test_data` here can be simply replaced by `result.data` in prod!
// })
// .catch(err => {
//   console.error(err);
// });

// let apiUrl;

// if (office === 'all' || !office) {

//   apiUrl = `${process.env.REACT_APP_API_URI}/fiscalSummary`;
// }
// else {
//   apiUrl = `${process.env.REACT_APP_API_URI}/citizenshipSummary`;
// }

export default connect()(GraphWrapper);
