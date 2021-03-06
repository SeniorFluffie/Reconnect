import React, { useState } from "react";
import { RouteComponentProps } from "react-router";

import "./SpeakerDetail.scss";
import { authRequest } from "../util/auth";

import { ActionSheetButton } from "@ionic/core";
import {
  IonActionSheet,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonButton,
  IonBackButton,
  IonTitle,
  IonPage,
  IonList,
  IonItem,
  IonLabel,
  IonAlert,
} from "@ionic/react";
import { callOutline, callSharp } from "ionicons/icons";
import { time, people } from "ionicons/icons";

import { connect } from "../data/connect";
import * as selectors from "../data/selectors";

import { Store } from "../models/Store";

interface OwnProps extends RouteComponentProps {
}

interface StateProps {}

interface DispatchProps {}

interface SpeakerDetailProps extends OwnProps, StateProps, DispatchProps {}

const SpeakerDetail: React.FC<SpeakerDetailProps> = () => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionSheetButtons, setActionSheetButtons] = useState<
    ActionSheetButton[]
  >([]);
  const [actionSheetHeader, setActionSheetHeader] = useState("");
  const [mapAlert, setMapAlert] = useState(false);
  const [QRAlert, setQRAlert] = useState(false);

  function openContact(store: Store) {
    setActionSheetButtons([
      // {
      //   text: `Email ( ${store.email} )`,
      //   handler: () => {
      //     window.open("mailto:" + speaker.email);
      //   },
      // },
      {
        text: `Call ( ${store.phone} )`,
        handler: () => {
          window.open("tel:" + store.phone);
        },
      },
    ]);
    setActionSheetHeader(`Contact ${store.name}`);
    setShowActionSheet(true);
  }
  const [uuid, setUUID] = React.useState("");
  const [store, setStore] = React.useState();
  React.useEffect(() => {
    const pk = window.location.pathname.split("/")[3];
    if (store)
      authRequest.get(`/api/v1/store/${pk}/retrieve_code`).then((res) => { console.log(res.data); setUUID(res.data); });
  }, [store]);

  React.useEffect(() => {
    const pk = window.location.pathname.split("/")[3];
    authRequest.get(`/api/v1/store/${pk}`).then((res) => { console.log(res.data); setStore(res.data); });
  }, []);


  if (!store) {
    return <div>Speaker not found</div>;
  }

  let map_image = `<img src="/assets/img/speakers/map_longos.png"/>`;
  let qr_image = `<img src="http://localhost:8000/api/v1/code/${uuid}/qr.png" />`;

  return (
    <IonPage id="speaker-detail">
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/store" />
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => openContact(store)}>
                <IonIcon
                  color="primary"
                  slot="icon-only"
                  ios={callOutline}
                  md={callSharp}
                ></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        {mapAlert && (
          <IonAlert
            isOpen={mapAlert}
            onDidDismiss={() => setMapAlert(false)}
            cssClass="map-alert"
            header={"Google Maps"}
            subHeader={"Would you like to open Google Maps?"}
            message={map_image}
            buttons={["Cancel", "Open Maps"]}
          />
        )}

        {QRAlert && (
          <IonAlert
            isOpen={QRAlert}
            onDidDismiss={() => setQRAlert(false)}
            cssClass="qr-alert"
            header={"QR Code"}
            subHeader={"Please scan your QR code at the storefront."}
            message={qr_image}
            buttons={["OK"]}
          />
        )}

        {/* <div
          style={{ backgroundImage: `url(${speaker.bannerPic})` }}
          className="speaker-background"
        /> */}

        <div
          className="ion-padding speaker-detail"
          style={{ marginBottom: "0px", paddingBottom: "0px" }}
        >
          <h2 style={{ marginBottom: "0px" }}>{store.name}</h2>
          {/* <span style={{ color: "grey" }}>{speaker.address}</span> */}
          <div className="widgets_div">
            <div className="icon_div">
              <span>
                <IonIcon color="primary" icon={time} />
              </span>
            </div>
            <div className="text_div">
              <span>
                <b>Mon - Fri:</b> 9:00 a.m. - 9:00 p.m.
              </span>
              <br />
              <span>
                <b>Sat - Sun:</b> 9:00 a.m. - 5:00 p.m.
              </span>
              <br />
            </div>
          </div>

          <hr />
          <IonTitle style={{ marginTop: "12px" }}>Reviews</IonTitle>
          <IonList inset style={{ marginTop: "0px" }}>
            <IonItem>
              <IonLabel>
                <div className="text_div">
                  <span>
                    <b>Anonymous</b>{" "}
                    <p style={{ float: "right", fontSize: "8pt" }}>1 Day Ago</p>
                  </span>
                  <br />
                  <span>Customer service is great</span>
                </div>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <div className="text_div">
                  <span>
                    <b>Jessica F</b>{" "}
                    <p style={{ float: "right", fontSize: "8pt" }}>
                      3 Days Ago
                    </p>
                  </span>
                  <br />
                  <span>The employees were very respectful</span>
                </div>
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                <div className="text_div">
                  <span>
                    <b>David C</b>{" "}
                    <p style={{ float: "right", fontSize: "8pt" }}>
                      6 Days Ago
                    </p>
                  </span>
                  <br />
                  <span>Safe, clean, and accomodating!</span>
                </div>
              </IonLabel>
            </IonItem>
          </IonList>
        </div>

        <div className="ion-padding speaker-page-bottom">
          <div className="icon-div">
            <IonIcon
              color="primary"
              style={{ paddingRight: "16px", height: "24px", width: "24px" }}
              icon={people}
            />
            <p>The capacity is currently 18 of 40.</p>
          </div>
          <div>
            <IonButton color="secondary" onClick={() => setMapAlert(true)}>
              Open Maps
            </IonButton>
          </div>
          <div>
            <IonButton color="primary" onClick={() => setQRAlert(true)}>
              Check-In
            </IonButton>
          </div>
        </div>
      </IonContent>
      <IonActionSheet
        isOpen={showActionSheet}
        header={actionSheetHeader}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={actionSheetButtons}
      />
    </IonPage>
  );
};

export default connect({
  mapStateToProps: (state, ownProps) => ({
    store: selectors.getStoreList(),
  }),
  component: SpeakerDetail,
});
