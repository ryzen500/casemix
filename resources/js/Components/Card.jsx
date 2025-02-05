
export default function Card({ className = '', children, ...props }) {
    return (
        <div className="card">
            <div className="card-body px-3 py-4-5">
                {children}

            </div>
        </div>
    );
}
