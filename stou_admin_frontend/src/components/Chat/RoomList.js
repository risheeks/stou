import React from 'react'
import { Modal, Button, Form, Col, Row, Image } from "react-bootstrap";

class RoomList extends React.Component {
    render () {
        if (this.props.rooms.length > 0) {
            console.log(this.props.rooms);
            const orderedRooms = [...this.props.rooms].sort((a, b) => a.id > b.id)
            return (
                <div className="rooms-list">
                    <ul>
                    <h3>All rooms:</h3>
                        {orderedRooms.map(room => {
                            const active = room.id === this.props.roomId ? 'active' : '';
                            return (
                                <li key={room.id} className={"room " + active}>
                                    <Button onClick={() => this.props.getRoomMessages(room.id)}>
                                        {/* {console.log(room.id)} */}
                                        {room.name}
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )
        }
        else {
            return (
                <div className="rooms-list">
                    <ul>
                    <li>No Rooms Avalable for User</li>
                    </ul>
                </div>
            )
        }
    }
}

export default RoomList