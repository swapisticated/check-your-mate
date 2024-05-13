export const Button = ({ onClick , children }: {onClick:()=> void,children:React.ReactNode})=>{
    return <button onClick={onClick}  className="px-5 py-4 text-xl bg-[#78b970] font-bold rounded-md hover:bg-[rgb(120,145,112)]">
        {children}
      </button>
}