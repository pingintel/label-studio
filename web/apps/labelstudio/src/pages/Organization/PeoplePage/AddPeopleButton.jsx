import { useState, useCallback, useEffect, useRef } from "react";
import { Block, Elem } from "../../../utils/bem";
import { Description } from "../../../components/Description/Description";
import { useConfig } from "../../../providers/ConfigProvider";
import { LsPlus } from "../../../assets/icons";
import { Space } from "../../../components/Space/Space";
import { Button } from "../../../components";
import { Input } from "../../../components/Form";
import { useAPI } from "../../../providers/ApiProvider";
import { modal } from "../../../components/Modal/Modal";
import { copyText } from "../../../utils/helpers";

const InvitationModal = ({ link }) => {
  return (
    <Block name="invite">
      <Input value={link} style={{ width: "100%" }} readOnly />

      <Description style={{ marginTop: 16 }}>
        Invite people to join your Label Studio instance. People that you invite
        have full access to all of your projects.{" "}
        <a
          href="https://labelstud.io/guide/signup.html"
          target="_blank"
          rel="noreferrer"
        >
          Learn more
        </a>
        .
      </Description>
    </Block>
  );
};

const AddPeopleButton = () => {
  const api = useAPI();
  const inviteModal = useRef();
  const config = useConfig();
  const [link, setLink] = useState();

  const setInviteLink = useCallback(
    link => {
      const hostname = config.hostname || location.origin;

      setLink(`${hostname}${link}`);
    },
    [config, setLink]
  );

  const updateLink = useCallback(() => {
    api.callApi("resetInviteLink").then(({ invite_url }) => {
      setInviteLink(invite_url);
    });
  }, [setInviteLink]);

  const inviteModalProps = useCallback(
    link => ({
      title: "Invite people",
      style: { width: 640, height: 472 },
      body: () => <InvitationModal link={link} />,
      footer: () => {
        const [copied, setCopied] = useState(false);

        const copyLink = useCallback(() => {
          setCopied(true);
          copyText(link);
          setTimeout(() => setCopied(false), 1500);
        }, []);

        return (
          <Space spread>
            <Space>
              <Button style={{ width: 170 }} onClick={() => updateLink()}>
                Reset Link
              </Button>
            </Space>
            <Space>
              <Button primary style={{ width: 170 }} onClick={copyLink}>
                {copied ? "Copied!" : "Copy link"}
              </Button>
            </Space>
          </Space>
        );
      },
      bareFooter: true
    }),
    []
  );

  const showInvitationModal = useCallback(() => {
    inviteModal.current = modal(inviteModalProps(link));
  }, [inviteModalProps, link]);

  useEffect(() => {
    api.callApi("inviteLink").then(({ invite_url }) => {
      setInviteLink(invite_url);
    });
  }, []);

  useEffect(() => {
    inviteModal.current?.update(inviteModalProps(link));
  }, [link]);

  return (
    <Button icon={<LsPlus />} primary onClick={showInvitationModal}>
      Add People
    </Button>
  );
};

export default AddPeopleButton;
