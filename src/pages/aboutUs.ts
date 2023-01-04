import { ModuleInterface } from "./types"

class About implements ModuleInterface {
   
   
    bind = () => {
      
    }
    render = () => {

        return `
        
            <div class='idea'>
            <h1>IT STARTED WITH A SIMPLE IDEA</h1>
            <p>WHAT IF WE MADE EXACTLY WHAT YOU WANTED?</p>
            </div>
         <div class="container">   
            <div class="rewind">
                <h2>Let’s rewind</h2>
                <div>It all started in 2006. Two brothers, Emil and Linus, struggled to find quality gear to ride in. They ordered some from the States, and their buddies were so impressed that they wanted some too. What began as a small project importing gear previously unavailable in Sweden for a small group of friends quickly snowballed into something special.</div>
                <div>After a few years of selling the big brands, they heard tons of great product ideas, and it seemed those big brands weren’t listening. Then they had an idea. Surely, the best people to create with are those who ride, roam, and follow their passion every day.</div>
                <div>Ridestore was born with one simple, underpinning ethos: The customer is the brand. The community has always been at the heart of Ridestore, and that’s never going to change. After all, the first customers were friends, and that’s still how we like to think of it today.</div>
                <div>So, we opened the lines of communication with you, our customers. We threw out the rulebook, disregarded ‘traditional’ company structures, and set out to make our own line of snow gear with the rider community at its core.</div>
                <div>The result? Dope – where the only ‘boss’ is the customer.</div>
            </div>
        </div>
        `
    }
}

export default About