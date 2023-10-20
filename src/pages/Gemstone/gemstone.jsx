import React from 'react';
import { Breadcrumb, Container } from 'reactstrap';

const gemstone = () => {
    return (
        <div>
            <Container>
                <div className="breadcrumb">
                    <Breadcrumb routeSegments={[{ name: "Gemstone" }]} />
                    <h1>hello</h1>
                </div>
            </Container>
        </div>
    );
}

export default gemstone;
