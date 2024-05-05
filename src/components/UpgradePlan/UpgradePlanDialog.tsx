import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import EmailDashboardAPIs, { iCreditUsage } from "../../apis/Email/email.dashboard.apis";

export default function UpgradePlanDialog() {
  const KEY = 'last_time_upgrade_check';
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    localStorage.setItem(KEY, new Date().getTime().toString());
  };

  const isOverQuota = (data: iCreditUsage): boolean => {
    for (const prop in data) {
      const usage = data[prop as keyof iCreditUsage].progress;
      if (usage > 99)
        return true
    }
    return false;
  };

  useEffect(() => {
    const last_checked = window.localStorage.getItem(KEY);
    const now = new Date().getTime();
    if (!last_checked || now - parseInt(last_checked) > 24 * 1000 * 60 * 60) {
      new EmailDashboardAPIs().credits_usage().then((res) => {
        if(isOverQuota(res)) handleShow()
      });
    }
  }, []);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Plan Upgrade Required</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>You are exceeding your Plans Quota. To use all features provided by Emailwish, Upgrade your Plan to a higher Tier.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Link to="/account/subscription">
          <Button variant="primary" onClick={handleClose}>Upgrade</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
