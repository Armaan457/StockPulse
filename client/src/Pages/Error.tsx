import notFound404 from "/notfoundError.svg";

const Error = () => {
	return (
		<div className="bg-stone-100 h-screen grid place-items-center">
			<img
				src={notFound404}
				alt="ErrorIcon"
			/>
			{/* <h1 className="text-5xl text-black font-semibold">
				Pages Does not Exist
			</h1> */}
		</div>
	);
};

export default Error;
