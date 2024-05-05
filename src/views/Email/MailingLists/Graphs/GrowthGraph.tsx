import * as React from "react";
import EmailMailingListAPIs from "../../../../apis/Email/email.mailinglists.apis";
import Echart from "../../../../components/Echart/Echart";

interface iProps {
    uid: string
}

interface iState {
    loading: boolean
    error: string
    response: any,
    mounted: boolean
}

class GrowthGraph extends React.Component<iProps, iState> {
    state: iState = {
        loading: false,
        error: "",
        response: undefined,
        mounted: true,
    };

    fetchGraph = () => {
        this.setState({loading: true, error: ""});
        new EmailMailingListAPIs().list_growth(this.props.uid).then(r => this.onFetchGraphResponse(r));
    };

    onFetchGraphResponse = (r: any) => {
        if (this.state.mounted) {
            if (EmailMailingListAPIs.hasError(r, undefined)) {
                this.setState({
                    loading: false,
                    response: undefined,
                    error: EmailMailingListAPIs.getError(r)
                })
            } else {
                this.setState({
                    loading: false,
                    response: r,
                    error: ""
                })
            }
        }

    };

    render() {
        if (!this.state.response)
            return "";

        return <Echart response={this.state.response}/>
    }

    componentDidMount(): void {
        this.fetchGraph();
    }

    componentWillUnmount() {
        this.setState({
            mounted: false
        })
    }
}

export default GrowthGraph;
