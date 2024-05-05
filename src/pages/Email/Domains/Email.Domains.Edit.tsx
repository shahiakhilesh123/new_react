import useIsMounted from "ismounted";
import { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import EmailDomainAPIs from "../../../apis/Email/email.domains.apis";
import { NotificationContext } from "../../../App";
import AppCard from "../../../components/Card/AppCard";
import AppLoader from "../../../components/Loader/AppLoader";
import { iEmailSendingDomain, iEmailSendingDomainDNSRecord } from "../../../types/internal";
import { Form, Button, InputGroup } from 'react-bootstrap';
import VerifiedIcon from "@material-ui/icons/Done";
import UnverifiedIcon from "@material-ui/icons/ErrorOutline";
import HeadingCol from "../../../components/heading/HeadingCol";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from "@material-ui/core/TableHead";

function EmailDomainsEdit() {
    const { domain_uid } = useParams<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [sendingDomain, setSendingDomain] = useState<iEmailSendingDomain>();
    const [dnsRecords, setDnsRecords] = useState<iEmailSendingDomainDNSRecord[] | undefined>();
    const [error, setError] = useState<string | undefined>();
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);

    const loadSendingDomain = useCallback(() => {
        setLoading(true);
        new EmailDomainAPIs().view(domain_uid).then((res) => {
            if (isMounted.current) {
                if (EmailDomainAPIs.hasError(res, notificationContext)) {
                    setError(res.message);
                } else {
                    setSendingDomain(res.server);
                    setDnsRecords(res.records);
                    console.log(res.records);
                    console.log(res.server);
                }
                setLoading(false);
            }

        });
    }, [])

    useEffect(() => {
        loadSendingDomain();
    }, []);

    if (loading) {
        return <AppLoader />
    }

    const copyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value);
    };

    return (
        <>
            <HeadingCol title="Domain Verification"
                description={"Add the following entries to your Domains DNS settings"} />
            <AppCard className="p-3 email-segmentation--card">
                <h5>TXT Records</h5>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">TXT Value</TableCell>
                            <TableCell align="left">Verified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dnsRecords?.map((row) => (
                            <TableRow key={row.host_name}>
                                <TableCell component="th" scope="row">
                                    {row.host_name}
                                </TableCell>
                                <TableCell align="left">{row.value}</TableCell>
                                <TableCell align="left">{row.verified ? <VerifiedIcon color="action" /> : <UnverifiedIcon color="error" />}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AppCard>
        </>)

}

export default EmailDomainsEdit;
